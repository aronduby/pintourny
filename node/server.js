var redis = require("redis"),
	listener = redis.createClient(),
	io = require('socket.io').listen(835,{
		'close timeout': 3600, // 60 minutes to re-open a closed connection
		'browser client minification': true,
		'browser client etag': true,
		'browser client gzip': true
	});


io.sockets.on('connection', function(socket){});


listener.on('message', function(channel, evt){
	evt = JSON.parse(evt);

	var type = evt.type,
		data = evt.data;

	io.emit(type, data);
});
listener.subscribe('pp3');