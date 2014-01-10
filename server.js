var app = require('express')()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);

server.listen(8080);

var sockets = io.sockets;
app.get('/', function(req, res){
	res.sendfile(__dirname+'/index.html');
});

sockets.on('connection', function(socket){
	socket.emit('news', {hello:'world'});

	socket.on('broadcast', function(data){
        	console.log("server recieved: "+data);
        	socket.broadcast.emit('msg', data);
	});


});

