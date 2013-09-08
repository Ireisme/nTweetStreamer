'use strict';

/* Controllers */
function MainCtrl($scope){
	$scope.alerts = [];

	$scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };
}

function SidebarCtrl($scope, $http, socket, streams){

    $http.get('ang-config.json').success(function(data){
      var uri = "http://" + data.serverAddress;

      $http.get(uri + "/streamcontrol/credentials").success(function(data){
      	$scope.totalCredentials = data.count;
      });
    });

	streams.getStreams(function(data){
		$scope.usedCredentials = 
			_.filter(data, function(s){ return s.status === "Running";}).length;
	});

	socket.on('stream-start', function(streamId)
	{
		$scope.usedCredentials++;
	});

	socket.on('stream-stop', function(streamId)
	{
		$scope.usedCredentials--;
	});
}

function StreamsCtrl($scope, $http, socket, streams) {

	var onError = function(error){
		$scope.alerts.push(error);
	}

	streams.getStreams(function(data){
		$scope.streams = $scope.formatStreams(data);
	}, onError);

	$scope.streamAction = function(stream){
		if(stream.status === "Stopped")
		{
			$http.get('ang-config.json').success(function(config){
				var uri = "http://" + config.serverAddress;
				$http.post(uri + "/streamcontrol/start/" + stream._id).success(function(data){
					if(data === 'Ok')
					{
						stream.status = "Running";
						stream.action = "Stop";
					}
				});
			});
		}
		else if(stream.status === "Running")
		{
			$http.get('ang-config.json').success(function(config){
				var uri = "http://" + config.serverAddress;
				$http.post(uri + "/streamcontrol/stop/" + stream._id);
			});
			stream.status = "Stopped";
			stream.action = "Start";
		}
	};

	socket.on('stream-start', function(streamId)
	{
		var scopeStream =
			_.find($scope.streams, function(s){ return s._id === streamId.streamId; });

		if(scopeStream)
			scopeStream.status = 'Running';
			scopeStream.action = "Stop";
	});

	socket.on('stream-stop', function(streamId)
	{
		var scopeStream =
			_.find($scope.streams, function(s){ return s._id === streamId.streamId; });

		if(scopeStream)
			scopeStream.status = 'Stopped';
			scopeStream.action = "Start";
	});

	socket.on('stream-save', function(stream)
	{
		var scopeStream =
			_.find($scope.streams, function(s){ return s._id === stream.streamId; });

		if(scopeStream)
			scopeStream = angular.copy(stream, scopeStream);
		else
		{
			if(stream.status === "Stopped")
				stream.action = "Start";
			else if(stream.status === "Running")
				stream.action = "Stop";

			$scope.streams.push(stream);
		}
	});

	socket.on('stream-tweet', function(streamId)
	{
		var scopeStream =
			_.find($scope.streams, function(s){ return s._id === streamId.streamId; });

		if(scopeStream)
			scopeStream.tweetCount++;
	});

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

		streams.addStream(stream, null, onError);
		$scope.addStreamModal = false;
	};

	$scope.addStreamCancel = function(){
		$scope.addedStream = {};
		$scope.addStreamModal = false;
	};

		streams.deleteStream(_id, onError);
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
