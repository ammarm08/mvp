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