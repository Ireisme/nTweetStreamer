var express = require('express');
var _ = require('underscore');
var static = require('node-static');

var repository = require('./lib/data/repository.js');
var streamController = require('./lib/streamController.js');
var streamProcess = require('./lib/streamProcess.js');

var app = express();
app.use(express.bodyParser());

//Angular serving
var fileServer = new static.Server('./ang/app/');

require('http').createServer(function (request, response) {
	fileServer.serve(request, response);
}).listen(8088);

app.all('/streams', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	next();
});

app.all('/streamcontrol/:action/:id', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
	next();
});

//Streams
app.post('/streams', function(req, res){
	var stream = req.body;
	if(stream)
	{
		console.log(stream);
		repository.saveStream(stream, function(data) {
			res.send(data);
		});
	}
});

app.get('/streams/:id', function(req, res){
	if(req.params.id)
	{
		repository.findStream(req.params.id, function(data) {
			res.send(data);
		});
	}
});

app.get('/streams', function(req, res){
	repository.getAllStreams(function(streams) {
		var send = _.after(streams.length, function(){
			res.send(streams);
		});

		streams.forEach(function(s){
			repository.getTweetCount(s._id, function(count){
				s.tweetCount = count;
				s.status = streamController.running(s._id) ? "Running" : "Stopped";
				send();
			});
		});
	});
});

app.delete('/streams/:id', function(req, res){
	if(req.params.id)
	{
		repository.deleteStream(req.params.id, function(data) {
			res.send(data);
		});
	}
});

//Stream Control
app.post('/streamcontrol/:action/:id', function(req, res){
	var streamId = req.params.id;

	if(req.params.action == 'start')
		streamController.start(streamId);
	else if(req.params.action == 'stop')
		streamController.stop(streamId);
	else
		res.send("Unknown action.");

	res.send("Ok");
});

//Tweets
//
app.get('/tweets/:id', function(req, res){
	if(req.params.id)
		repository.getTweets(req.params.id, function(data) {
			res.send(data);
		});
});

app.listen(3000);
