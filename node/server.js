var redis = require("redis"),
	listener = redis.createClient(),
	io = require('socket.io').listen(773,{
		'close timeout': 3600, // 60 minutes to re-open a closed connection
		'browser client minification': true,
		'browser client etag': true,
		'browser client gzip': true
	});


io.sockets.on('connection', function(socket){
	var domain = socket.handshake.headers.host,
		sub_domain = domain.split('.').shift();

	socket.join(sub_domain);
});


listener.on('message', function(channel, evt){
	evt = JSON.parse(evt);

	var type = evt.type,
		data = evt.data,
		room = evt.room;

	io.to(room).emit(type, data);
});
listener.subscribe('pintourny');