var net = require('net');
require('date-util');

function getConnection(connName){
  var client = net.connect({port: 33300, host:'192.168.219.200'}, function() {
    console.log(connName + ' 연결 됨.');
    //console.log(`로컬 : ${this.localAddress} / ${this.localPort}`);
    //console.log(`리모트 : ${this.remoteAddress} / ${this.remotePort}`);
    //this라고 써도 됨. this = client
 
    //client.setTimeout(500);
    //client.setEncoding('base64');
 
    this.on('data', function(data) {
       // var jsonToData = JSON.parse(JSON.stringify(Buffer.from(data, 'base64'))).data;
       console.log("받았어 : " + data + " / " + new Date().format("yyyy-mm-dd HH:MM:ss"));
      //client.end();
    });
    client.on('end', function() {
      console.log(connName + 'disconnected!');
    });
    client.on('error', function(err) {
      console.log('error : ', JSON.stringify(err));
    });
    client.on('timeout', function() {
      console.log('소켓 타임아웃');
    });
    client.on('close', function() {
      console.log('소켓 닫힘');
      client.reconnect(5*1000);
    });
    client.reconnect = interval =>{
        setTimeout(() => {
            console.log('서버와 재연결 중');
            client.connect(33300, '192.168.219.200')
        }, interval)
    }
  });
  return client;
}
 
function writeData(socket, data){
  var success = !socket.write(data);
  if (!success){
    (function(socket, data){
      socket.once('drain', function(){
        writeData(socket, data);
        client.end();
      });
    })(socket, data);
  }
}
var robo2 = getConnection("robo2");
var moveRobotTime = function(){
	
	//var Elves = getConnection("Elves");
	//var Hobbits = getConnection("Hobbits");
	//let data = [35,3,3,1,0,3,52,182,0,3,57,130,0,0,0,2,0,0,0,1,0,0,7,210,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35];
  let data = "하하하하";
  let jsonArr = {
    a1 : "123"
    ,a2 : "456"
    ,a3 : "789"
    ,a4 : new Date().format("yyyy-mm-dd HH:MM:ss")
  };
	//writeData(robo3, Buffer.from(JSON.stringify(jsonArr)));
  writeData(robo2, data);
  console.log('보냈어 : ' + new Date().format("yyyy-mm-dd HH:MM:ss"));
	//writeData(Elves, "More Arrows");
	//writeData(Hobbits, "More Pipe Weed");	
}
moveRobotTime();
setInterval(moveRobotTime, 1000 * 30);