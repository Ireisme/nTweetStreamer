var twitter = require('ntwitter');
var repository = require('./data/repository.js');

var credentials = {};
var running = false;
var credentials = {};

function runStream(stream){
	var t = new twitter({
		consumer_key: credentials.consumer_key,
		consumer_secret: credentials.consumer_secret,
		access_token_key: credentials.access_token_key,
		access_token_secret: credentials.access_token_secret
	});

	t.stream('statuses/filter', { track: stream.query }, function(tweetStream) {
		tweetStream.on('data', function(tweet){
			if(running)
			{
				console.log('Found tweet: ' + stream._id);
				repository.saveTweet(stream._id, { 'tweet':tweet.text });
			}
			else
				tweetStream.close();
		});
	});
}

process.on('message', function(data){
	console.log("Message sent to process: %j", data);
	if(data.credentials)
		credentials = data.credentials;

	if(data.action)
	{
		if(data.action === "start")
		{
			repository.findStream(data.streamId, function(stream){
				console.log("Stream from db: " + stream);
				running = true;
				runStream(stream);
			});
		}
		else if(data.action === "stop")
		{
			running = false;
		}
	}
});
