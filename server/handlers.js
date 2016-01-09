var request = require('request');

var geniusKey = process.env.GENIUS_KEY || require('./key.js').geniusKey;
var youtubeKey = process.env.YOUTUBE_KEY || require('./key.js').youtubeKey;

var Genius = require("node-genius");
var geniusClient = new Genius(geniusKey);

var YouTube = require('youtube-node');
var youtube = new YouTube();
youtube.setKey(youtubeKey);

// request handlers

exports.fetchArtists = function(req, res, next) {

  var artist = req.body.artist;

  geniusClient.search(artist, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
}

exports.fetchSongs = function(req, res, next) {

  var songId = req.body.song;

  geniusClient.getSong(songId, {text_format: 'plain'}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
}

exports.fetchReferents = function(req, res, next) {

  var song_id = req.body.song

  var baseRequest = request.defaults({
    baseUrl: "https://api.genius.com",
    headers: { "Authorization": "Bearer " + geniusKey }
  });

  var options = {
    url: '/referents',
    qs: {song_id: song_id, text_format: 'plain'}
  }

  baseRequest(options, function(err, data) {
    if (err) {
      console.log(err);
      return;
    }

    res.json(data);
  });

}

exports.searchYoutube = function(req, res, next) {

  var query = req.body.artist + " " + req.body.title;
   
  youtube.search(query, 2, function(error, result) {
    if (error) {
      console.log(error);
    }
    else {
      console.log(JSON.stringify(result, null, 2));
      res.json(result);
    }
  });

}