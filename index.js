var express = require('express');
var _ = require('underscore');

var app = express();
app.use(express.bodyParser());

require('./lib/routes/streams.js')(app);
require('./lib/routes/tweets.js')(app);

app.listen(3000);

var static = require('node-static');

//Angular serving
var fileServer = new static.Server('./ang/app/');

require('http').createServer(function (request, response) {
	fileServer.serve(request, response);
}).listen(8088);

