'use strict';

/* Services */
app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

app.factory('streams', function($http){
  var uri;

  var promise = $http.get('ang-config.json').success(function(config){
      uri = "http://" + config.serverAddress;
  });

  return {
    promise: promise,
    getStreams: function(callback){
      $http.get(uri + "/streams").success(function(data){
        if(callback)
          callback(data);
      });
    },
    addStream: function(stream, callback){
      $http.post(uri + "/streams", stream).success(function(data){
        if(callback)
          callback(data);
      });
    },
  };
});
