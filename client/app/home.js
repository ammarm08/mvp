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