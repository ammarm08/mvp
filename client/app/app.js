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

    var request = function(artist){};

    return {
      request: request
    }
  })

angular.module('graffiti.home', [])
  .controller('HomeController', function($scope, $location, Artists) {

    $scope.data = {};

  })

angular.module('graffiti.songs', [])
  .controller('ResultsController', function($scope, $location, Artists) {

    $scope.data = {};

  })
