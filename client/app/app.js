angular.module('graffiti', ['graffiti.services', 'graffiti.home', 'graffiti.songs', 'ngRoute'])
  .config(function($routeProvider, $httpProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'home.html',
        controller: 'HomeController'
      })
      .when('/results', {
        templateUrl: 'results.html',
        controller: 'ResultsController'
      })
      .otherwise({ 
        redirectTo: '/home'
      })
  });

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

    // var fetchPreview = function(code) {

    //   var codeString = 'isrc:' + code;
    //   var type = '&type=track'
    //   var uri = 'http://api.spotify.com/v1/search?q=' + codeString + type; 

    //   return $http({
    //     method: 'GET',
    //     url: uri
    //   })
    //   .then(function (res) {
    //     return res;
    //   })
    // }

    return {
      request: request,
      // fetchPreview: fetchPreview
    }
  })

angular.module('graffiti.home', [])
  .controller('HomeController', function($scope, $location, Artists) {

    $scope.data = {};

    $scope.getData = function() {
      Artists.request($scope.data, 'artists')
      .then(function(res) {
        var parsed = JSON.parse(res);
        Artists.set(parsed.response);
        $location.path('/results');
      })
    }

  })

angular.module('graffiti.songs', [])
  .controller('ResultsController', function($scope, $location, $sce, Artists, SpotifyPreview) {

    $scope.data = Artists.get();
    $scope.data.artist = $scope.data.hits[0].result.primary_artist.name || null;
    console.log($scope.data);

    $scope.getAnnotations = function(id) {
      Artists.request({song: id}, 'songs')
      .then(function(res) {
        var parsed = JSON.parse(res);
        
        SpotifyPreview.request(parsed.response.song.title, $scope.data.artist)
        .then(function(previewUrl) {
          $scope.data.current = $sce.trustAsResourceUrl(previewUrl);
          document.getElementById('current').play();
        })
      })
    }

  })
