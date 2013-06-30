var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var mongoUri;

fs.readFile('./config/mongo-config.json', function(err, data){
	if(err)
	{
		console.log("Error Loading MongoConfig:" + err);
		return;
	}

	mongoUri = JSON.parse(data).mongoUri;
});

var tweetModel = {};

//Get Tweets
tweetModel.getTweets = function(id, callback){
	MongoClient.connect(mongoUri, function(err, db) {
		if(err) { return console.log(err); }

		var collection = db.collection(id);
		collection.find().toArray(function(err, results){
			if(callback)
				callback(results);

			db.close();
		});
	});
};

//Save Tweets
tweetModel.saveTweet = function(collection, tweet, callback){
	MongoClient.connect(mongoUri, function(err, db){
		if(err) { return console.log("Error Inserting Tweet:" + err); }
		var tweets = db.collection(collection);
		tweets.insert({'tweet':tweet}, function (err, inserted) {
		});

		if(callback)
			callback("Ok");

		db.close();
	});
};

module.exports = tweetModel;
