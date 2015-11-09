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
  .controller('ResultsController', function($scope, $location, Artists) {

    $scope.data = Artists.get();
    console.log($scope.data);

    $scope.getAnnotations = function(id) {
      Artists.request({song: id}, 'songs')
      .then(function(res) {
        var parsed = JSON.parse(res);
        console.log(parsed.response.song);
      })
    }

  })
