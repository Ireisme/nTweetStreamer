var express = require('express');
var _ = require('underscore');

var repository = require('./data/repository.js');
var streamController = require('./streamController.js');

var app = express();
app.use(express.bodyParser());

//Streams
app.post('/streams', function(req, res){
	var stream = req.body;
	if(stream)
	{
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
	else
		streamController.stop(streamId);

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
