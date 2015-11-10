var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var app = express();
var musicRouter = express.Router();

// PORT
var port = process.env.PORT || 3000;

//Genius API interface
var tokens = require('key.js');
var Genius = require("node-genius");
var geniusClient = new Genius(tokens.geniusKey);

//Youtube Search API interface
var YouTube = require('youtube-node');
var youtube = new YouTube();
youtube.setKey(tokens.youtubeKey);


//middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));
app.use('/api/music', musicRouter);

//request handlers
var basicStuff = function(req, res, next) {
  res.send('test');
}

var fetchArtists = function(req, res, next) {

  var artist = req.body.artist;

  geniusClient.search(artist, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
}

var fetchSongs = function(req, res, next) {

  var songId = req.body.song;

  geniusClient.getSong(songId, {text_format: 'plain'}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
}

var fetchReferents = function(req, res, next) {

  var song_id = req.body.song

  var baseRequest = request.defaults({
    baseUrl: "https://api.genius.com",
    headers: { "Authorization": "Bearer " + tokens.geniusKey }
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

var searchYoutube = function(req, res, next) {

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
//router

musicRouter.get('/', basicStuff);
musicRouter.post('/artists', fetchArtists);
musicRouter.post('/songs', fetchSongs);
musicRouter.post('/referents', fetchReferents);
musicRouter.post('/youtube', searchYoutube);

//fire up the server
console.log('Listening on 3000');
app.listen(port);

