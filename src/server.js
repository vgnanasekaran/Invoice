//server.js
'use strict';
const bodyParser = require('body-parser');
//first we import our dependencies…
var express = require('express');
//and create our instances
var app = express();
var router = express.Router();
//set our port to either a predetermined port number if you have set
//it up, or 3001
var port = process.env.API_PORT || 3001;
//now we should configure the API to use bodyParser and look for
//JSON data in the request body
//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
 res.setHeader('Access-Control-Allow-Origin', '*');
 res.setHeader('Access-Control-Allow-Credentials', 'true');
 res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
 res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
//and remove cacheing so we get the most recent comments
 res.setHeader('Cache-Control', 'no-cache');
 next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//now we can set the route path & initialize the API
require('./routes/express/InvoiceRoutes')(app);
require('./routes/express/CustomerRoutes')(app);
require('./routes/express/ProductRoutes')(app);
//initialize mysql db pool
var mysqlPool = require('./models/mysqldb').pool;
//starts the server and listens for requests
app.listen(port, function() {
 console.log(`api running on port ${port}`);
});
