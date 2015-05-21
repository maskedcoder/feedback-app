var express = require('express');
var app = express();

// Load Express Configuration
require('./expressConfig')(app, express);

// Root route
app.get('/', function(req, res) {
  res.sendFile('index.html', {root: app.settings.views});
});

// Load routes
require('./models/products')(app, express);

module.exports = app;
