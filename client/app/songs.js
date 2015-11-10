angular.module('graffiti.songs', [])
  .controller('ResultsController', function($scope, $location, $sce, $interval, Artists, SpotifyPreview, Genius) {

    $scope.data = Artists.get();
    $scope.data.artist = $scope.data.hits[0].result.primary_artist.name || null;

    $scope.getAnnotations = function(id, title) {
      $scope.data.song = title;
      $scope.data.video = "";

      Genius.request($scope.data.artist, $scope.data.song)
      .then(function(res) {
        var videoId = res.items[0].id.videoId;
        $scope.data.video = $sce.trustAsResourceUrl('http://www.youtube.com/embed/' + videoId + "?rel=0&autoplay=1");

      })

      Artists.request({song: id}, 'referents')
      .then(function(res) {
        var parsed = JSON.parse(res.body);
        $scope.data.annotations = Genius.flatten(parsed.response.referents);

        // $scope.data.annotations = parsed.response.song.description_annotation.annotations[0].body.plain;
        
        // SpotifyPreview.request(parsed.response.song.title, $scope.data.artist)
        // .then(function(previewUrl) {
        //   $scope.data.current = $sce.trustAsResourceUrl(previewUrl);
        //   document.getElementById('current').play();
        // })
      })
    }

  })