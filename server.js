var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var app = express();
var musicRouter = express.Router();

//Genius API interface
var token = require('key.js').key;
var Genius = require("node-genius");
var geniusClient = new Genius(token);

//Youtube Search API interface
var secret = 'NaevNT7q6EGTCqL1sB7eSzk3';
var code = '241567937961-k4r7fom3cksnhma1m0qar7bq23etb0ba.apps.googleusercontent.com';
var api = 'AIzaSyA0iXbcuswUS6a7_tKhS9jgBsjs9aJFxiE';
var YouTube = require('youtube-node');
var youtube = new YouTube();
youtube.setKey(api);


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
    headers: { "Authorization": "Bearer " + token }
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
app.listen(3000);

