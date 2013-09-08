var express = require('express');
var _ = require('underscore');

var angularApp = express();
angularServer = require('http').createServer(angularApp);
var io = require('socket.io').listen(angularServer);
io.set('log level', 1);
angularApp.configure(function(){
	angularApp.use(express.static(__dirname + '/public'));
});

var restApp = express();
restApp.use(express.bodyParser());

require('./lib/routes/streams.js')(restApp, io);
require('./lib/routes/tweets.js')(restApp, io);

var fs = require('fs'), config;

fs.readFile('./config/config.json', function(err, data){
  if(err)
  {
    console.log("Error Loading MongoConfig:" + err);
    return;
  }
  config = JSON.parse(data);
  
  angularServer.listen(config.angularPort);
  restApp.listen(config.serverPort);
});