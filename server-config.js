var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var app = express();
var musicRouter = express.Router();
var controller = require('./handlers');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

if (process.env.NODE_ENV) {
  app.use(express.static(__dirname + '/dist'));
} else {
  app.use(express.static(__dirname + '/client'));
}

app.use('/api/music', musicRouter);

musicRouter.get('/', controller.allGood);
musicRouter.post('/artists', controller.fetchArtists);
musicRouter.post('/songs', controller.fetchSongs);
musicRouter.post('/referents', controller.fetchReferents);
musicRouter.post('/youtube', controller.searchYoutube);

module.exports = app;