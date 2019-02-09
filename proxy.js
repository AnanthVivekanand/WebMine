const WebSocket = require('ws');
const net = require('net');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  var client = new net.Socket();
  client.setEncoding('utf8');
  client.connect(3333, "grlcgang.com", () => {
  });
  client.on('data', function(data) { 
    console.log(data);
	if (ws.readyState === WebSocket.OPEN) {
    ws.send(data);
}
   });
  ws.on('message', function incoming(message) {
    console.log('received: %s', message, ", now forwarding");
    client.write(message);
  });

});
