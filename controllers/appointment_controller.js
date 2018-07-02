var bodyParser = require('body-parser');
var User = require('../models/user');

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app, requiresLogin) {
  app.get('/appointment', requiresLogin, function(req, res) {
    accepted_appointments = [];
    pending_appointments = [];
    rejected_appointments = [];
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      user.appointments.forEach(function(a) {
        if(a.accepted){
          accepted_appointments.push(a);
        }
        else if (a.rejected) {
          rejected_appointments.push(a);
        }
        else{
          pending_appointments.push(a);
        }
      });
      res.render('appointment', {accepted_appointments: accepted_appointments, rejected_appointments: rejected_appointments, pending_appointments: pending_appointments});

    });
  });

  app.post('/appointment', urlencodedParser, function(req, res, next) {
    var appointment = {
      title: req.body.app_title,
      description: req.body.app_description,
      start: req.body.app_start,
      end: req.body.app_end,
      date: req.body.app_date,
      meeting_user: req.body.meeting_user,
      accepted: false,
      rejected: false
    };
    var appointment_request = {
      from_user: 'not set',
      title: req.body.app_title,
      start: req.body.app_start,
      end: req.body.app_end,
      date: req.body.app_date
    };
    User.findOne({username: req.body.meeting_user}).exec(function(err, user) {
      var user_to = user;
      if(err || !user){
        res.statusCode = 400;
        return res.send('The user you want to meet does not exist.');
      }
      User.findOne({_id: req.session.userId}).exec(function(err, user) {
        var username = user.username;
        if(username == appointment.meeting_user){
          res.statusCode = 400;
          return res.send('You cannot meet yourself');
        }
        else{
          appointment_request.from_user = username;
          user_to.appointments_request.push(appointment_request);
          User.updateOne({username: req.body.meeting_user}, {appointments_request: user_to.appointments_request}).then(function() {
            User.findOne({_id: req.session.userId}).exec(function(err, user) {
              user.appointments.push(appointment);
              User.updateOne({_id: req.session.userId}, {appointments: user.appointments}).then(function() {
                User.findOne({_id: req.session.userId}).exec(function(err, user) {
                  id = user.appointments[user.appointments.length-1]._id;
                  User.findOne({username: req.body.meeting_user}).exec(function(err, user) {
                    user.appointments_request[user.appointments_request.length-1]._id = id;
                    appointment._id = id;
                    User.updateOne({username: req.body.meeting_user}, {appointments_request: user.appointments_request}).then(function() {
                      appointment.from_user = username;
                      return res.send(JSON.stringify(appointment));
                    });
                  });
                });
              });
            });
          });
        }

      });
    });
  });

  app.delete('/appointment', urlencodedParser, function(req, res) {
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      appointments = [];
      user.appointments.forEach(function(a) {
        if(a._id != req.body.id){
          appointments.push(a);
        }
      });
      User.updateOne({_id: req.session.userId}, {appointments: appointments}).then(function() {
        res.statusCode = 200;
        res.send();
      });
    });
  });
}
