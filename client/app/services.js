angular.module('graffiti.services', [])
  .factory('API', function($http) {

    var savedData = {};

    var get = function() {
      return Object.keys(savedData).length ? savedData : false;
    };

    var set = function(val) {
      savedData = val;
    };

    var geniusRequest = function(query, endpoint){

      return $http({
          method: 'POST',
          url: '/api/music/' + endpoint,
          data: query
        })
        .then(function (res) {
          return res.data;
        });
    };

    var youtubeRequest = function(artist, title) {

      var options = {artist: artist, title: title};

      return $http({
        method: 'POST',
        url: '/api/music/youtube',
        data: options
      })
      .then(function (res) {
        return res.data;
      })
    };

    return {
      geniusRequest: geniusRequest,
      youtubeRequest: youtubeRequest,
      set: set,
      get: get
    }
  })
  .factory('Helpers', function($http) {

    var flatten = function(list) {
      var result = [];

      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var notes = item.annotations[0].body.plain;
        var sentences = notes.split('. ');
        result = result.concat(sentences);
      }

      return result;
    };

    return {
      flatten: flatten,
    }

  })