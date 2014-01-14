var app = require('express')()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);

server.listen(8080);

var sockets = io.sockets;
app.get('/', function(req, res){
	res.sendfile(__dirname+'/index.html');
});

var users = {};

sockets.on('connection', function(socket){
	socket.emit('news', {hello:'world'});

	socket.on('broadcast', function(data){
        	console.log("server recieved: "+data);
        	socket.broadcast.emit('msg', data);
	});


	socket.on('login', function(data){
		
		console.log('login:' + data);
		socket.name = data.name;	
		users[data.name] = 1;
		socket.broadcast.emit('notice', {'type':'login','username':data.name});
	});
	
	socket.on('disconnect', function(data){
		console.log('disconnect:' + data);
		users[socket.name] = 0;
		socket.broadcast.emit('notice',{'type':'logout','data':data});
	});
});

