'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('nTweetStreamer', ['ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/', {
    templateUrl: 'partials/main.html',
      resolve:{
      'streamData':function(streams){
        return streams.promise;
      }
    }
  })
  $routeProvider.otherwise({redirectTo: '/'});;
}]);

app.config(['$httpProvider', function($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
	}
]);
