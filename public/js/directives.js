'use strict';

/* Directives */


angular.module('nTweetStreamer.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);
