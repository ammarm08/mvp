var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var musicRouter = express.Router();

//Genius API interface
var token = require('key.js').key
var Genius = require("node-genius");
var geniusClient = new Genius(token);

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

//router

musicRouter.route('/').get(basicStuff);

musicRouter.route('/artists')
  .get(basicStuff)
  .post(fetchArtists);

musicRouter.route('/songs')
  .get(basicStuff)
  .post(fetchSongs);

//fire up the server
console.log('Listening on 3000');
app.listen(3000);

