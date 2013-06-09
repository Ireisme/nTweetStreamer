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

	$scope.streamAction = function(stream){
		if(stream.status === "Stopped")
		{
			$http.post("http://localhost:3000/streamcontrol/start/" + stream._id);
			stream.status = "Running";
			stream.action = "Stop";
		}
		else if(stream.status === "Running")
		{
			$http.post("http://localhost:3000/streamcontrol/stop/" + stream._id);
			stream.status = "Stopped";
			stream.action = "Start";
		}
	};

	$scope.getStreams = function(){
		$http.get("http://localhost:3000/streams").success(function(data){
			$scope.streams = $scope.formatStreams(data);
		});
	};

	$scope.addStream = function(stream){
		$http.post("http://localhost:3000/streams", stream).success(function(data){
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
		streams.forEach(function(stream){
			if(stream.status === "Stopped")
				stream.action = "Start";
			else if(stream.status === "Running")
				stream.action = "Stop";
		});

		return streams;
	};

	$scope.getStreams();
}
