const net = require("net");
const express = require("express");
const app = express();
let emitter = require("events");
require("date-util");
let hostport = 33300;
let hostip = "192.168.219.200";
var clientUser;

function getConnection(connName) {
	var client = net.connect({ port: hostport, host: hostip }, function () {
		this.on("connect", function () {
			console.log(connName + " connected!");
		});

		this.on("data", function (data) {
			console.log("받았어 : " + data + " / " + new Date().format("yyyy-mm-dd hh:mm:ss"));
      		//client.end();
    	});

		this.on("end", function () {
			console.log(connName + " disconnected!");
		});

		this.on("error", function (err) {
			console.log("error : ", JSON.stringify(err));
		});

		this.on("timeout", function () {
			console.log("소켓 타임아웃");
		});

		this.on("close", function () {
			console.log("소켓 닫힘");
			client.reconnect(5 * 1000);
		});

		this.reconnect = (interval) => {
			setTimeout(() => {
				console.log(connName + " 서버와 재연결 중");
				client.connect(hostport, hostip);
			}, interval);
		};
  	});
  	return client;
}

emitter.setMaxListeners(5);

function writeData(socket, data) {
	var success = !socket.write(data);
	if (!success) {
		(function (socket, data) {
			socket.on("drain", function () {
				console.log("!success");
				writeData(socket, data);
				socket.end();
			});
		})(socket, data);
	}
}

var moveRobotTime = function () {
	let data = "음오아예";
	let jsonarr = {
		a1: "123",
		a2: "456",
		a3: "789",
		a4: new Date().format("yyyy-mm-dd HH:MM:ss"),
	};
	writeData(clientUser, data);
	console.log(clientUser.listenerCount("drain"));
	if (clientUser.listenerCount("drain") > 0) {
		clientUser.removeAllListeners("drain");
	}
	console.log("보냈어 : " + new Date().format("yyyy-mm-dd HH:MM:ss"));
};
app.get("/", (req, res) => {
	res.send("client open!");
	console.log("client open!");
});
app.get("/viewer", (req, res) => {
	clientUser = getConnection("viewer");
	res.send("viewer open!");
	console.log("viewer open!");
});

app.get("/robot", (req, res) => {
	clientUser = getConnection("robot");
	//moveRobotTime();
	setInterval(moveRobotTime, 1000 * 5);
	res.send("robot open!");
	console.log("robot open!");
});

const server = app.listen(33080, () => {
  	console.log(__dirname);
});
