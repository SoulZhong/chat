var app = require('express')()
, server = require('http').createServer(app)
, io = require('socket.io').listen(server);

server.listen(8080);

var sockets = io.sockets;
app.get('/', function(req, res){
	res.sendfile(__dirname+'/index.html');
});

app.get('/test.html',function(req, res){
	res.sendfile(__dirname+'/test.html');
});

var users = {};

sockets.on('connection', function(socket){
	socket.emit('notice', {'list':users});

	socket.on('broadcast', function(data){
        	console.log("server recieved: "+data);
        	socket.broadcast.emit('msg', data);
	});


	socket.on('login', function(data){
		
		console.log('login:' + data);
		socket.name = data.name;	
		users[data.name] = 1;
		socket.broadcast.emit('notice', {'type':'login','username':data.name, 'list':users});
	});
	socket.on('logout', function(data){
		console.log('logout:' + data);
		users[data.name] = 0;
		socket.broadcast.emit('notice', {'type':'logout', 'username':data.name, 'list':users});
		
	});
		
	socket.on('disconnect', function(data){
		console.log('disconnect:' + data+", socket.name:" + socket.name);
		if(socket.name != undefined){
			users[socket.name] = 0;
			socket.broadcast.emit('notice',{'type':'logout', 'username':socket.name, 'list':users});
		}
	});
});

