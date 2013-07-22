var express = require('express');
var _ = require('underscore');

var repository = require('../model/streams.js');
var streamController = require('../streamController.js');
var streamProcess = require('../streamProcess.js');

module.exports = function(app){
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
				streamController.start(streamId);
			else if(req.params.action == 'stop')
				streamController.stop(streamId);
			else
				res.send("Unknown action.");

			res.send("Ok");
	});

	app.all('/streamcontrol/active', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
		next();
	});

	app.get('/streamcontrol/active', function(req, res) {
		getStreams(function(streams){
			res.send(streams);
		}, true);
	});

	function getStreams(callback, activeOnly) {

		var getMetadata;

		if(activeOnly)
			getMetadata = function(streams, metaCallback){
				var running = streamController.allRunning();

				var active = _.filter(streams, function(stream){ return _.contains(running, stream._id); });

				if(active)
				{
					var send = _.after(active.length, function(){
						if(metaCallback)
							metaCallback(active);
					});

					active.forEach(function(s){
						repository.getTweetCount(s._id, function(count){
							s.tweetCount = count;
							s.status = "Running";
							send();
						});
					});
				}
				else
					if(metaCallback)
						metaCallback([]);
			};
		else
			getMetadata = function(streams, metaCallback){

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
