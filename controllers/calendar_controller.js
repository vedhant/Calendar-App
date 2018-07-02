var bodyParser = require('body-parser');
var User = require('../models/user');

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app, requiresLogin) {
  app.get('/calendar', requiresLogin, function(req, res) {
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      if(err){
        return callback(err);
      }
      res.render('calendar', {user: JSON.stringify(user)});
    });
  });

  app.get('/', requiresLogin, function(req, res) {
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      if(err){
        return callback(err);
      }
      res.render('calendar', {user: JSON.stringify(user)});
    });
  });

  app.post('/calendar', urlencodedParser, function(req, res, next) {
    var appointment = {
      title: req.body.app_title,
      description: req.body.app_description,
      start: req.body.app_start,
      end: req.body.app_end,
      date: req.body.app_date
    };
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      if(err){
        return callback(err);
      }
      user.appointments.push(appointment);
      User.updateOne({_id: req.session.userId}, {appointments: user.appointments}).then(function() {
        res.redirect('/calendar');
      });
    });
  })
};
