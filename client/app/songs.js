angular.module('graffiti.songs', [])
.controller('ResultsController', function($scope, $location, $sce, $interval, API, Helpers) {

  $scope.data = {note: "Whoops, something went wrong. Go home and search again!"};
  $scope.image = "";
  $scope.current = { artist: "", title: "" }

  if (API.get()) {
    $scope.data = API.get();
    $scope.data.artist = $scope.data.hits[0].result.primary_artist.name || null;
  }

  var runningInterval;

  $scope.redirect = function() {
    $location.path('/home');
  }

  $scope.getAnnotations = function(id, title, img) {

    $scope.current.title = title;
    $scope.current.artist = $scope.data.artist + ": ";

    $scope.data.song = title;
    $scope.data.video = "";
    $scope.image = img;
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

});