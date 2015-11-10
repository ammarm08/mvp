
angular.module('graffiti', [
  'graffiti.services', 
  'graffiti.home', 
  'graffiti.songs', 
  'ngRoute', 
  'ui.bootstrap',
  'youtube-embed'
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
