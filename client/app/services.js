angular.module('graffiti.services', [])
  .factory('Artists', function($http) {

    var savedData = {};

    var get = function() {
      return savedData;
    };

    var set = function(val) {
      savedData = val;
    };

    var request = function(query, endpoint){

      return $http({
          method: 'POST',
          url: '/api/music/' + endpoint,
          data: query
        })
        .then(function (res) {
          return res.data;
        });
    };

    return {
      request: request,
      set: set,
      get: get
    }
  })
  .factory('SpotifyPreview', function($http) {

    var request = function(song, artist, isrc) {

      var artistString = 'artist:' + artist + '+';
      var songString = 'title:' + song;
      var limit = '&type=track&limit=1'
      var uri = 'http://api.spotify.com/v1/search?q=' + artistString + songString + limit; 

      return $http({
        method: 'GET',
        url: uri
      })
      .then(function (res) {
        return res.data.tracks.items[0].preview_url;
      })
    }

    return {
      request: request,
    }
  })
  .factory('Genius', function($http) {

    var flatten = function(list) {
      var result = [];

      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var notes = item.annotations[0].body.plain;
        result.push(notes);
      }

      return result;
    };

    var request = function(artist, title) {

      var options = {artist: artist, title: title};

      return $http({
        method: 'POST',
        url: '/api/music/youtube',
        data: options
      })
      .then(function (res) {
        return res.data;
      })
    }

    return {
      flatten: flatten,
      request: request
    }
  })