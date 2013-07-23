var express = require('express');
var _ = require('underscore');

var angularApp = express();
angularServer = require('http').createServer(angularApp);
var io = require('socket.io').listen(angularServer);
angularApp.configure(function(){
	angularApp.use(express.static(__dirname + '/public'));
});

angularServer.listen(8088);

var restApp = express();
restApp.use(express.bodyParser());

require('./lib/routes/streams.js')(restApp, io);
require('./lib/routes/tweets.js')(restApp, io);

restApp.listen(3000);

