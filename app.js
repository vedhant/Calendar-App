var express = require('express');
var signupController = require('./controllers/signup_controller');
var loginController = require('./controllers/login_controller');
var calendarController = require('./controllers/calendar_controller');
var logoutController = require('./controllers/logout_controller');
var appointmentController = require('./controllers/appointment_controller');
var invitesController = require('./controllers/invites_controller');
var dayController = require('./controllers/day_controller.js');
var socketController = require('./controllers/socket_controller');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://admin:admin123@ds217671.mlab.com:17671/calendar-app-db');
var db = mongoose.connection;

var app = express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(session({
  secret: 'you-cannot-guess-the-secret-key',
  resave: true,
  saveUninitialized: false,
  // store: new MongoStore({
  //   mongooseConnection: db
  // })
}));

function requiresLogin(req, res, next){
  if (req.session && req.session.userId) {
    return next();
  }else {
    var error = new Error('You must be logged in to view this page.');
    error.status = 401;
    res.render('login_error', {error: error.message});
  }
}

var server = app.listen(5000, function() {
  console.log('you are listening to port 5000');
});

signupController(app);
loginController(app);
logoutController(app);
calendarController(app, requiresLogin);
appointmentController(app, requiresLogin);
invitesController(app, requiresLogin);
dayController(app, requiresLogin);
socketController(server);


// app.use(function(err, req, res, next){
//   res.status(err.status || 500);
//   res.send(err.message);
// });
