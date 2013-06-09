var express = require('express');

var repository = require('../model/tweets.js');

module.exports = function(app){
	//Tweets
	app.get('/tweets/:id', function(req, res){
		if(req.params.id)
			repository.getTweets(req.params.id, function(data) {
				res.send(data);
			});
	});
};
