var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/tweets";

var tweetModel = {};

//Get Tweets
tweetModel.getTweets = function(id, callback){
	MongoClient.connect(mongoUrl, function(err, db) {
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
	MongoClient.connect(mongoUrl, function(err, db){
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
