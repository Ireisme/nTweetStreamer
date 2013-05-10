var assert = require("chai").assert;
var proxy = require('proxyquire');

var creds = [
	{
		consumer_key: 'first key',
		consumer_secret: 'first secret',
		access_token_key: 'first tokenkey',
		access_token_secret: 'first tokensecret'
	},
	{
		consumer_key: 'second key',
		consumer_secret: 'second secret',
		access_token_key: 'second tokenkey',
		access_token_secret: 'second tokensecret'
	}
];

var child = {
	fork: function(file){
		return {
			messages: [],
			send: function(message){
				this.messages.push(message);
			},
			exit: function(){}
		};
	}
};

process.on = function(msg){};

describe('streamController', function(){
	describe('processes', function(){
		it('should create a process for each credential', function(){
			var controller = proxy('../lib/streamController.js',
				{ '../config/credentials.js': creds, 'child_process': child });
			assert.equal(2, controller.processes.length);
		});
	});
});

describe('streamController', function () {
	describe('processes', function() {
		it('should have empty streamIds', function () {
			var controller = proxy('../lib/streamController.js',
				{ '../config/credentials.js': creds, 'child_process': child });
			controller.processes.forEach(function(p){
				assert.equal('', p.streamId);
			});
		});
	});
});

describe('streamController', function () {
	describe('start', function() {
		it('should assign stream to a process with no stream',
			function () {
				var controller = proxy('../lib/streamController.js',
					{ '../config/credentials.js': creds, 'child_process': child });
				controller.processes[0].streamId = 'firstId';
				controller.start('secondId');
				assert.equal('secondId', controller.processes[1].streamId);
			});
	});
});

describe('streamController', function () {
	describe('start', function() {
		it('should ignore if stream is already attached to another process',
			function () {
				var controller = proxy('../lib/streamController.js',
					{ '../config/credentials.js': creds, 'child_process': child });
				controller.processes[0].streamId = 'firstId';
				controller.start('firstId');
				assert.notEqual('firstId', controller.processes[1].streamId);
			});
	});
});

describe('streamController', function () {
	describe('start', function() {
		it('should send streamProcess correct message', function () {
			var controller = proxy('../lib/streamController.js',
				{ '../config/credentials.js': creds, 'child_process': child });
			controller.start('firstId');
			assert.equal('start',
				controller.processes[0].process.messages[1].action);
			assert.equal('firstId',
				controller.processes[0].process.messages[1].streamId);
		});
	});
});

describe('streamController', function () {
	describe('stop', function() {
		it('should send streamProcess correct message', function () {
			var controller = proxy('../lib/streamController.js',
				{ '../config/credentials.js': creds, 'child_process': child });
			controller.start('firstId');
			controller.stop('firstId');
			assert.equal('stop',
				controller.processes[0].process.messages[2].action);
		});
	});
});

