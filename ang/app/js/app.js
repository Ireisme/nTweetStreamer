'use strict';


// Declare app level module which depends on filters, and services
angular.module('nTweetStreamer', ['ui.bootstrap','nTweetStreamer.filters', 'nTweetStreamer.services', 'nTweetStreamer.directives', 'nTweetStreamer.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/streams', {templateUrl: 'partials/streams.html', controller: 'StreamsCtrl'});
    $routeProvider.otherwise({redirectTo: '/streams'});
}]);
