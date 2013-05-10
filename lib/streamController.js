var credentials = require('../config/credentials.js');
var child = require('child_process');
var _ = require('underscore');

var controller = {};

controller.processes = [];

credentials.forEach(function(cred) {
	var p = child.fork("./lib/streamProcess.js");
	p.send({ credentials: cred });
	controller.processes.push({
		creds: cred,
		process: p,
		streamId: ""
	});
});

controller.start = function(streamId){
	var process = _.find(controller.processes, function(p){ return p.streamId === streamId; });
	if(!process)
	{
		process = _.find(controller.processes, function(p) { return (!p.streamId); });
		if(process)
		{
			process.streamId = streamId;
			process.process.send({ action: "start", streamId: process.streamId });
		}
	}
};

controller.stop = function(streamId){
	var process = _.find(controller.processes, function(p){ return p.streamId === streamId; });

	if(process)
	{
		process.streamId = null;
		process.process.send({ action: "stop" });
	}
};

process.on('exit', function() {
	controller.processes.forEach(function(p){
		p.exit();
	});
});

module.exports = controller;
