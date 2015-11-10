
angular.module('graffiti', [
  'graffiti.services', 
  'graffiti.home', 
  'graffiti.songs', 
  'ngRoute', 
  'ui.bootstrap',
])

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

    return {
      request: request,
    }
  })
  .factory('Genius', function() {

    var read = function(data) {
      
    };

    return {
      read: read
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
  .controller('ResultsController', function($scope, $location, $sce, $interval, Artists, SpotifyPreview, Genius) {

    $scope.data = Artists.get();
    $scope.data.artist = $scope.data.hits[0].result.primary_artist.name || null;

    $scope.getAnnotations = function(id) {
      Artists.request({song: id}, 'songs')
      .then(function(res) {
        var parsed = JSON.parse(res);
        $scope.data.annotations = parsed.response.song.description_annotation.annotations[0].body.plain.split('.');

        if ($scope.running) $interval.cancel($scope.textAnimation);
        $scope.textAnimation;
        
        SpotifyPreview.request(parsed.response.song.title, $scope.data.artist)
        .then(function(previewUrl) {
          $scope.data.current = $sce.trustAsResourceUrl(previewUrl);
          document.getElementById('current').play();
        })
      })
    }

    $scope.textAnimation = $interval(function() {
      if ($scope.data.annotations.length === 0) {
        $scope.data.annotations = [];
        $scope.running = false;
        $interval.cancel($scope.textAnimation);
      }

      $scope.running = true;
      $scope.data.note = $scope.data.annotations.shift();
    }, 3000)

  })
