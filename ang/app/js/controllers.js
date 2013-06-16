'use strict';

/* Controllers */
function StreamsCtrl($scope, $http) {
/*	$scope.streams = [
		{
			_id: "First Stream",
			query: "track: bottoms",
			tweetCount: "800"
		},
		{
			_id: "Second Stream",
			query: "\"locations\": \"-122.75,36.8,-121.75,37.8\"",
			tweetCount: "800"
		}
	];*/

	$http.get('config.json').success(function(data){
		$scope.uri = "http://" + data.serverAddress;
		$scope.getStreams();
	});

	$scope.streamAction = function(stream){
		if(stream.status === "Stopped")
		{
			$http.post($scope.uri + "/streamcontrol/start/" + stream._id);
			stream.status = "Running";
			stream.action = "Stop";
		}
		else if(stream.status === "Running")
		{
			$http.post($scope.uri + "/streamcontrol/stop/" + stream._id);
			stream.status = "Stopped";
			stream.action = "Start";
		}
	};

	$scope.getStreams = function(){
		$http.get($scope.uri + "/streams").success(function(data){
			$scope.streams = $scope.formatStreams(data);
		});
	};

	$scope.addStream = function(stream){
		$http.post($scope.uri + "/streams", stream).success(function(data){
			$scope.getStreams();
		});
	};

	$scope.addStreamOpen = function(){
		$scope.addedStream = {};
		$scope.addStreamModal = true;
	};

	$scope.addStreamClose = function(){
		$scope.addedStream.query = { track: $scope.addedStream.query };
		$scope.addStream($scope.addedStream);
		$scope.addStreamModal = false;
	};

	$scope.addStreamCancel = function(){
		$scope.addedStream = {};
		$scope.addStreamModal = false;
	};

	$scope.formatStreams = function(streams){

		if(streams)
		{
			streams.forEach(function(stream){
				if(stream.status === "Stopped")
					stream.action = "Start";
				else if(stream.status === "Running")
					stream.action = "Stop";
			});
		}

		return streams;
	};
}
