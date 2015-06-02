var bodyParser = require('body-parser');
var path = require('path');
var express = require('express');

// Load non-database
var dataStore = require('./models');

// Load routes
var products = require('./routes/products')(dataStore);
var companies = require('./routes/companies')(dataStore);

var app = express();

// Set the view directory, this enables us to use the .render method inside routes
app.set('views', path.join(__dirname, '/../app/views'));

// Serve static files
app.use('/', express.static('app/'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Root route
app.get('/', function(req, res) {
  res.sendFile('index.html', {root: app.settings.views});
});

// Mount routers
app.use('/products', products);
app.use('/companies', companies);

module.exports = app;
