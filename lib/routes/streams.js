var express = require('express');
var _ = require('underscore');

module.exports = function(app, socket){
	var repository = require('../model/streams.js');
	var streamController = require('../streamController.js')(socket);

	//Streams
	app.all('/streams', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
		next();
	});

	app.all('/streams/:id', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
		next();
	});

	app.post('/streams', function(req, res){
		var stream = req.body;
		if(stream)
		{
			console.log(stream);
			repository.saveStream(stream, function(data) {
				res.send(data);

				socket.sockets.emit('stream-save', {
					_id: stream._id,
					type: stream.type,
					query: stream.query,
					tweetCount: 0,
					status: "Stopped"
				});
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
		getStreams(function(streams) {
			res.send(streams);
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
	app.all('/streamcontrol/:action/:id', function(req, res, next) {
			res.header("Access-Control-Allow-Origin", "*");
			res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
			res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
			next();
		});

	app.post('/streamcontrol/:action/:id', function(req, res){
			var streamId = req.params.id;

			if(req.params.action == 'start')
			{
				if(streamController.start(streamId))
					res.send('Ok');
				else
					res.send('No credentials available.');
			}
			else if(req.params.action == 'stop')
				streamController.stop(streamId);
			else
				res.send("Unknown action.");

	});

	app.all('/streamcontrol/credentials', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
		next();
	});

	app.get('/streamcontrol/credentials', function(req, res){
		res.send({ count: streamController.availableCredentials.length });
	});

	function getStreams(callback, activeOnly) {

		var getMetadata = function(streams, metaCallback){

			var send = _.after(streams.length, function(){
				if(metaCallback)
					metaCallback(streams);
			});

			streams.forEach(function(s){
				repository.getTweetCount(s._id, function(count){
					s.tweetCount = count;
					s.status = streamController.running(s._id) ? "Running" : "Stopped";
					send();
				});
			});
		};

		repository.getAllStreams(function(streams) {

			getMetadata(streams, function(moreStreams){

				if(callback)
					callback(moreStreams);
			});
		});
	}
};
