var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var _ = require('underscore');
var twitter = require('ntwitter');

var credentials = require('./credentials.js');

var app = express();

//Streams
app.post('/streams', function(req, res){
	var stream = req.body;
	if(stream !== null)
	{
		MongoClient.connect("mongodb://localhost:27017/tweets", function(err, db)
		{
			if(err) { return console.log(err); }
			var collection = db.collection('streams');

			collection.save(stream, function(error, result){});
			res.send(stream);
			//collection.insert(stream, function(err, result) {});
		});
	}
});

app.get('/streams/:id', function(req, res){
	if(req.params.id !== null)
	{
		MongoClient.connect("mongodb://localhost:27017/tweets", function(err, db) {
			if(err) { return console.log(err); }

			var collection = db.collection('streams');
			collection.find({ _id: req.params.id }).toArray(function(err, items){
				res.send(items);
			});
		});
	}
});

app.delete('/streams/:id', function(req, res){
	if(req.params.id !== null)
	{
		MongoClient.connect("mongodb://localhost:27017/tweets", function(err, db) {
			if(err) { return console.log(err); }

			var collection = db.collection('streams');
			collection.remove( {_id: req.params.id}, function(err, result){});
			res.send('Ok');
		});
	}
});

//Stream Control
app.post('/streamcontrol/:action/:id', function(req, res){
	var running = false;
	if(req.params.action == 'start')
	{
		running = true;
	}

	MongoClient.connect("mongodb://localhost:27017/tweets", function(err, db) {
		if(err) { return console.log(err); }
		var streams = db.collection('streams');
		streams.update({_id: req.params.id}, {$set:{running: running }}, function(err, res){});

		if(running)
		{
			streams.findOne({ _id: req.params.id }, function(err, stream) {
				runStream(stream);
				res.send(stream);
			});
		}
	});
});

//Tweets
//
app.get('/tweets/:id', function(req, res){
	MongoClient.connect("mongodb://localhost:27017/tweets", function(err, db) {
		if(err) { return console.log(err); }

		var tweets = db.collection(req.params.id);
		collection.find().toArray(function(err, results){
			res.send(results);
			MongoClient.close();
		});
	});
});

app.get('/tweets/:name/csv', function(req, res){
	res.attachment('tweets.csv');
	res.end(toCSv(getTweets(req.params.name, function(err, items){ return items; })), 'UTF-8');
});

function runStream(toStream){
  MongoClient.connect("mongodb://localhost:27017/tweets", function(err, db){
    if(err) { return console.log(err); }
    var streams = db.collection('streams');

    var t = new twitter({
      consumer_key: credentials.consumer_key,
      consumer_secret: credentials.consumer_secret,
      access_token_key: credentials.access_token_key,
      access_token_secret: credentials.access_token_secret
    });

    var tweets = db.collection(toStream._id);
    t.stream('statuses/filter', { track: toStream.query }, function(tweetStream) {
      tweetStream.on('data', function(tweet){
        streams.findOne({ _id: toStream._id }, function(err,item) {
          if(item.running)
          {
            console.log('Found tweet: ' + toStream._id);
            tweets.insert({'tweet':tweet.text}, function (err, inserted) {
            });
          }
          else
          {
            console.log('Stream closed: ' + toStream._id);
            tweetStream.destroy();
          }
        });
      });
    });
  });
}


function persist(collection, data){
  MongoClient.connect("mongodb://localhost:27017/tweets", function(err, db){
    if(err) { return console.log(err); }
    var coll = db.collection(collection);
    coll.save(data);
  });
}


function toCsv(items){
	var csv = '';
	for (var i = 0; i < items.length; i++) {
		var line = '';
		for (var index in items[i]) {
			if (line !== '')
				line += ',';

			line += items[i][index];
		}

		str += line + '\r\n';
	}

	return csv;
}

app.listen(3000);
