var twitter = require('ntwitter');
var _ = require('underscore');
var streamModel = require('./model/streams.js');
var tweetModel = require('./model/tweets.js');

var credentials = require('../config/credentials.js');

var controller = {};
var io;

controller.availableCredentials = [];

credentials.forEach(function(cred) {
	controller.availableCredentials.push({
		credentials: cred,
		running: false,
		streamId: ""
	});
});

controller.start = function(streamId){
	var cred = _.find(controller.availableCredentials, function(c){ return c.streamId === streamId; });
	if(!cred)
	{
		cred = _.find(controller.availableCredentials, function(c) { return (!c.streamId); });
		if(cred)
		{
			cred.streamId = streamId;
			cred.running = true;
			streamModel.findStream(cred.streamId, function(stream){
				running = true;
				io.sockets.emit('stream-start', { streamId: streamId });
				runStream(stream, cred);
			});
			return true;
		}
		else
			return false;
	}
};

controller.stop = function(streamId){
	var cred = _.find(controller.availableCredentials, function(c){ return c.streamId === streamId; });

	if(cred)
	{
		cred.streamId = null;
		cred.running = false;
		io.sockets.emit('stream-stop', { streamId: streamId });
	}
};

controller.running = function(streamId){
	var cred = _.find(controller.availableCredentials, function(c){ return c.streamId === streamId; });

	return (cred ? true : false);
};

var streamProcess = {};

streamProcess.running = false;
streamProcess.credentials = {};

runStream = function(stream, credentials){
	var t = new twitter({
		consumer_key: credentials.credentials.consumer_key,
		consumer_secret: credentials.credentials.consumer_secret,
		access_token_key: credentials.credentials.access_token_key,
		access_token_secret: credentials.credentials.access_token_secret
	});

	t.stream('statuses/filter', stream.query, function(tweetStream) {
		tweetStream.on('data', function(tweet){
			if(credentials.running)
			{
				console.log('Found tweet: ' + stream._id);
				tweetModel.saveTweet(stream._id, tweet);
				io.sockets.emit('stream-tweet', { streamId: stream._id });
			}
			else
				tweetStream.destroy();
		});
		tweetStream.on('error', function(error, code){
			console.log("Error Streaming Tweets: %j", error);
		});
	});
};

module.exports = function(socket){
	io = socket;
	return controller;
};
