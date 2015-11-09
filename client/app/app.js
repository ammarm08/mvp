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

    var request = function(artist){

      return $http({
          method: 'POST',
          url: '/api/music',
          data: artist
        })
        .then(function (res) {
          return res.data;
        });
    };

    return {
      request: request
    }
  })

angular.module('graffiti.home', [])
  .controller('HomeController', function($scope, $location, Artists) {

    $scope.data = {};

    $scope.getData = function() {
      Artists.request($scope.data)
      .then(function(res) {
        var parsed = JSON.parse(res);
        console.log(parsed.response);
        $scope.data.artist='';
      })
    }

  })

angular.module('graffiti.songs', [])
  .controller('ResultsController', function($scope, $location, Artists) {

    $scope.data = {};

  })
