var net = require('net');
 
function getConnection(connName){
  var client = net.connect({port: 33300, host:'localhost'}, function() {
    console.log(connName + ' 연결 됨.');
    //console.log(`로컬 : ${this.localAddress} / ${this.localPort}`);
    //console.log(`리모트 : ${this.remoteAddress} / ${this.remotePort}`);
    //this라고 써도 됨. this = client
 
    //client.setTimeout(500);
    client.setEncoding('base64');
 
    this.on('data', function(data) {
        var jsonToData = JSON.parse(JSON.stringify(Buffer.from(data, 'base64'))).data;
        console.log(connName + " 한테서 데이터가 옴: " + jsonToData);
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
            client.connect(33300, 'op.plandlabs.com')
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
var robo3 = getConnection("robo3");
var moveRobotTime = function(){
	
	//var Elves = getConnection("Elves");
	//var Hobbits = getConnection("Hobbits");
	let data = [35,3,3,1,0,3,52,182,0,3,57,130,0,0,0,2,0,0,0,1,0,0,7,210,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,35];
	//console.log(Buffer.from(data));
	//console.log(typeof Buffer.from(data));
	//console.log(JSON.stringify(data));
	//socket.emit('data', Buffer.from(data));
	writeData(robo3, Buffer.from(data));
	//writeData(Elves, "More Arrows");
	//writeData(Hobbits, "More Pipe Weed");	
}
moveRobotTime();
setInterval(moveRobotTime, 1000 * 10);