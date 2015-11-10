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