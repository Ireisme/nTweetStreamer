'use strict';

/* Controllers */
function SidebarCtrl($scope, $http){

}

function StreamsCtrl($scope, $timeout, $http) {

	$http.get('ang-config.json').success(function(data){
		$scope.uri = "http://" + data.serverAddress;
		$scope.getStreams();
		$timeout(reload, 5000);
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

	function reload() {
		delete $http.defaults.headers.common['X-Requested-With'];
		$http.get($scope.uri + "/streamcontrol/active/").success(function(data){
			var streams = $scope.formatStreams(data);
			streams.forEach(function(stream){
				var scopeStream =
					_.find($scope.streams, function(s){ return stream._id === s._id; });

				if(scopeStream)
				{
					scopeStream.tweetCount = stream.tweetCount;
					scopeStream.status = stream.status;
					scopeStream.action = stream.action;
				}
				else
				{
					$scope.streams.push(stream);
				}
			});

			$timeout(reload, 1000);
		})
		.error(function(data, status, headers, config){

		});
	}

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
		var stream = {};

		stream._id = $scope.addedStream._id;
		stream.type = $scope.addedStream.type;

		if($scope.addedStream.type === "Track")
			stream.query = { track: $scope.addedStream.query };
		else if($scope.addedStream.type === "Location")
			stream.query =
				{ locations: $scope.addedStream.swLong + "," +
					$scope.addedStream.swLat + "," +
					$scope.addedStream.neLong + "," +
					$scope.addedStream.neLat
				};

		$scope.addStream(stream);
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
