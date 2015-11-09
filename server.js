var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var musicRouter = express.Router();

//Genius API interface
var Genius = require("node-genius");
var geniusClient = new Genius('Q8PH8LcJ-EP-l57t-sJiSSzhZUxMzOlNGoj9USpysNzc2KUjeBceenPsHTSoGMNi');

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

var fetchData = function(req, res, next) {

  var artist = req.body.artist;

  geniusClient.search(artist, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  })
}

//router
musicRouter.route('/')
  .get(basicStuff)
  .post(fetchData);

//fire up the server
console.log('Listening on 3000');
app.listen(3000);

