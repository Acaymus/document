// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var userController = require('./controllers/user');
var passport = require('passport');
var authController = require('./controllers/auth');
var clientController = require('./controllers/client');
var session = require('express-session');
var oauth2Controller = require('./controllers/oauth2');


// Connect to the MongoDB
mongoose.connect('mongodb://localhost:27017/cms_mitca');

// Create our Express application
var app = express();

// Set view engine to ejs
app.set('view engine', 'ejs');

// Use environment defined port or 3000
var port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({
    extended: true
}));

// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));

// Use the passport package in our application
app.use(passport.initialize());

// Create our Express router
var router = express.Router();

/ Create endpoint handlers for /users
router.route('/api/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// Create endpoint handlers for /clients
router.route('/api/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients);

// Create endpoint handlers for oauth2 authorize
router.route('/api/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/api/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

// Register all our routes
app.use(router);

// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('Insert beer on port ' + port);