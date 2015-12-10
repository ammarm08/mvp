
angular.module('graffiti', [
  'graffiti.services', 
  'graffiti.home', 
  'graffiti.songs', 
  'ngRoute', 
  'ui.bootstrap'
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

angular.module('graffiti.home', [])
  .controller('HomeController', function($scope, $location, API) {

    $scope.data = {};
    
    $scope.getData = function() {
      API.geniusRequest($scope.data, 'artists')
      .then(function(res) {
        var parsed = JSON.parse(res);
        API.set(parsed.response);
        $location.path('/results');
      })
    }

  })
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
angular.module('graffiti.songs', [])
  .controller('ResultsController', function($scope, $location, $sce, $interval, API, Helpers) {

    $scope.data = {note: "Whoops, something went wrong. Go home and search again!"};

    if (API.get()) {
      $scope.data = API.get();
      $scope.data.artist = $scope.data.hits[0].result.primary_artist.name || null;
    }

    var runningInterval;

    $scope.redirect = function() {
      $location.path('/home');
    }

    $scope.getAnnotations = function(id, title) {

      $scope.data.song = title;
      $scope.data.video = "";
      $scope.running = false;

      API.youtubeRequest($scope.data.artist, $scope.data.song)
      .then(function(res) {
        var videoId = res.items[0].id.videoId;
        $scope.data.video = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + videoId + "?rel=0&autoplay=1");
      })

      API.geniusRequest({song: id}, 'referents')
      .then(function(res) {
        var parsed = JSON.parse(res.body);
        $scope.data.annotations = Helpers.flatten(parsed.response.referents);
        $scope.startInterval();
      })
    }

    $scope.startInterval = function() {
      $scope.stopInterval();
      var items = $scope.data.annotations.slice(0);

      runningInterval = $interval(function() {

        if (items.length) {
          $scope.data.note = items.shift();
        }

      }, 5000);
    };

    $scope.stopInterval = function() {
      $interval.cancel(runningInterval);
    };

  })