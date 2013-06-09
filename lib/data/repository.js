var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/tweets";

var repository = {};

//Save streams
repository.saveStream = function(stream, callback){
	MongoClient.connect(mongoUrl, function(err, db)
	{
		if(err) { return console.log(err); }
		var collection = db.collection('streams');

		collection.save(stream, function(error, result){});

		if(callback)
			callback(stream);

		db.close();
	});
};

//Get All Streams
repository.getAllStreams = function(callback){
	MongoClient.connect(mongoUrl, function(err, db)
	{
		if(err) { return console.log(err); }
		var collection = db.collection('streams');

		collection.find().toArray(function(err, results){
			if(callback)
				callback(results);
		});

		db.close();
	});
};

//Tweets for a Stream
repository.getTweetCount = function(id, callback){
	MongoClient.connect(mongoUrl, function(err, db)
	{
		if(err) { return console.log(err); }
		var collection = db.collection(id);

		collection.count(function(err, count){
			if(callback)
				callback(count);
		});

		db.close();
	});
};

//Find Streams
repository.findStream = function(id, callback){
	MongoClient.connect(mongoUrl, function(err, db) {
		if(err) { return console.log(err); }
		var collection = db.collection('streams');
		collection.findOne({ _id: id }, function(err, item){
			console.log(item);

			if(callback)
				callback(item);
		});

		db.close();
	});
};

//Delete Streams
repository.deleteStream = function(id, callback){
	MongoClient.connect(mongoUrl, function(err, db) {
		if(err) { return console.log(err); }

		var collection = db.collection('streams');
		collection.remove( {_id: id}, function(err, result){});

		if(callback)
			callback("Ok");

		db.close();
	});
};

//Get Tweets
repository.getTweets = function(id, callback){
	MongoClient.connect(mongoUrl, function(err, db) {
		if(err) { return console.log(err); }

		var collection = db.collection(id);
		collection.find().toArray(function(err, results){
			if(callback)
				callback(results);
		});

		db.close();
	});
};

//Save Tweets
repository.saveTweet = function(collection, tweet, callback){
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

module.exports = repository;
