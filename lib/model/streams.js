var MongoClient = require('mongodb').MongoClient;
var fs = require('fs');

var mongoUri;

fs.readFile('./config/config.json', function(err, data){
	if(err)
	{
		console.log("Error Loading MongoConfig:" + err);
		return;
	}

	mongoUri = JSON.parse(data).mongoUri;
});

var streamModel = {};

//Save streams
streamModel.saveStream = function(stream, callback){
	MongoClient.connect(mongoUri, function(err, db)
	{
		if(err) { return console.log(err); }
		var collection = db.collection('streams');

		collection.save(stream, function(error, result){
			db.close();
		});

		if(callback)
			callback(stream);
	});
};

//Get All Streams
streamModel.getAllStreams = function(callback){
	MongoClient.connect(mongoUri, function(err, db)
	{
		if(err) { return console.log(err); }
		var collection = db.collection('streams');

		collection.find().toArray(function(err, results){
			if(callback)
				callback(results);

			db.close();
		});
	});
};

//Tweets for a Stream
streamModel.getTweetCount = function(id, callback){
	MongoClient.connect(mongoUri, function(err, db)
	{
		if(err) { return console.log(err); }
		var collection = db.collection(id);

		collection.count(function(err, count){
			if(callback)
				callback(count);

			db.close();
		});
	});
};

//Find Streams
streamModel.findStream = function(id, callback){
	MongoClient.connect(mongoUri, function(err, db) {
		if(err) { return console.log(err); }
		var collection = db.collection('streams');
		collection.findOne({ _id: id }, function(err, item){
			if(callback)
				callback(item);

			db.close();
		});
	});
};

//Delete Streams
streamModel.deleteStream = function(id, callback){
	MongoClient.connect(mongoUri, function(err, db) {
		if(err) { return console.log(err); }

		var collection = db.collection('streams');
		collection.remove( {_id: id}, function(err, result){});

		if(callback)
			callback("Ok");

		db.close();
	});
};

module.exports = streamModel;
