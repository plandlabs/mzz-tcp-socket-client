const net = require('net');
const express = require('express');
const app = express();
require('date-util');

let hostPort = 33300;
let hostIP = '192.168.219.200';
var clientUser;

function getConnection(connName){
  var client = net.connect({port: hostPort, host: hostIP}, function() {
    
    this.on('connect', function() {
      // var jsonToData = JSON.parse(JSON.stringify(Buffer.from(data, 'base64'))).data;
      console.log(connName + " connected!");
    });
    
    this.on('send', function() {
      // var jsonToData = JSON.parse(JSON.stringify(Buffer.from(data, 'base64'))).data;
      console.log(connName + " message");
    });

    this.on('data', function(data) {
      // var jsonToData = JSON.parse(JSON.stringify(Buffer.from(data, 'base64'))).data;
      console.log("받았어 : " + data + " / " + new Date().format("yyyy-mm-dd HH:MM:ss"));
      //client.end();
    });

    this.on('end', function() {
      console.log(connName + ' disconnected!');
    });

    this.on('error', function(err) {
      console.log('error : ', JSON.stringify(err));
    });

    this.on('timeout', function() {
      console.log('소켓 타임아웃');
    });

    this.on('close', function() {
      console.log('소켓 닫힘');
      client.reconnect(5 * 1000);
    });

    this.reconnect = interval =>{
        setTimeout(() => {
            console.log(connName + ' 서버와 재연결 중');
            client.connect(hostPort, hostIP)
        }, interval)
    }

  });
  return client;
}
 
function writeData(socket, data){
  var success = !socket.write(data);
  console.log(socket.listenerCount('connect'));
  if (!success){
    (function(socket, data){
      socket.once('drain', function(){
        writeData(socket, data);
        socket.end();
      });
    })(socket, data);
  }
}

var moveRobotTime = function(){
  let data = "음오아예";
  let jsonArr = {
    a1 : "123"
    ,a2 : "456"
    ,a3 : "789"
    ,a4 : new Date().format("yyyy-mm-dd HH:MM:ss")
  };
  writeData(clientUser, data);
  console.log('보냈어 : ' + new Date().format("yyyy-mm-dd HH:MM:ss"));
}
//setInterval(moveRobotTime, 1000 * 1);

app.get('/', (req, res) =>{
  clientUser = getConnection("robo3");
  moveRobotTime();
  res.send('client open!');
  console.log("client open!");
});

const server = app.listen(33080,  () => {
  console.log(__dirname);
});