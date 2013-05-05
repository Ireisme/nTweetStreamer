var credentials = require('../credentials.js');
var child = require('child_process');
var _ = require('underscore');

var processes = [];

credentials.forEach(function(cred) {
	var p = child.fork("./lib/streamProcess.js");
	p.send({ credentials: cred });
	processes.push({
		creds: cred,
		process: p,
		streamId: ""
	});
});

var controller = {};

controller.start = function(streamId){
	console.log("Starting stream with Id: " + streamId);
	var process = _.find(processes, function(p){ return p.streamId === streamId; });
	console.log("Process with matching streamId: " + process);

	if(!process)
	{
		process = _.find(processes, function(p) { return (!p.streamId); });
		console.log("Process without a streamId: " + process);
		if(process)
		{
			process.streamId = streamId;
			process.process.send({ action: "start", streamId: process.streamId });
		}
	}
};

controller.stop = function(streamId){
	var process = _.find(processes, function(p){ return p.streamId === streamId; });

	if(process)
	{
		process.streamId = null;
		process.process.send({ action: "stop" });
	}
};

process.on('exit', function() {
	processes.forEach(function(p){
		p.exit();
	});
});

module.exports = controller;
