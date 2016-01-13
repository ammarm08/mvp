//New Relic availability monitoring
require('newrelic');

var app = require('./server-config.js');
var port = process.env.PORT || 3000;

console.log('Listening on 3000');
app.listen(port);

