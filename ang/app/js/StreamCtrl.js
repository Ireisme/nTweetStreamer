function StreamCtrl($scope){
	$scope.streams = [
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
	];
}
