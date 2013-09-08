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

  var onError = function(callback){
    if(callback)
      callback({type: "error", msg: "Unable to contact server. Confirm location is correct in 'ang-config.json'"});
  }

  var promise = $http.get('ang-config.json').success(function(config){
      uri = "http://" + config.serverAddress;
  });

  return {
    promise: promise,
    getStreams: function(callback, error){
      $http.get(uri + "/streams")
      .success(function(data){
        if(callback)
          callback(data);
      })
      .error(function(data, status, header){
          onError(error);
          console.log(data);
        });
    },
    addStream: function(stream, callback, error){
      $http.post(uri + "/streams", stream)
      .success(function(data){
        if(callback)
          callback(data);
      })
      .error(onError(error));
    },
    deleteStream: function(id, callback, error){
      $http.delete(uri + "/streams/" + id)
      .success(function(data){
        if(callback)
          callback(data);
      })
      .error(onError(error));
  };
});
