var User = require('../models/user');
var bodyParser = require('body-parser');
var events = require('events');


var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app, requiresLogin) {
  app.get('/invites', requiresLogin, function(req, res) {
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      res.render('invites', {username: user.username});
    });
  });

  app.post('/invites', function(req, res) {
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      return res.send(JSON.stringify(user.appointments_request));
    });
  });

  app.put('/invites', urlencodedParser, function(req, res) {
    console.log(req.body);
    var done = 0;
    var myEmitter = new events.EventEmitter();
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      var appointments_request = [];
      var appointment_request = null;
      user.appointments_request.forEach(function(a) {
        if(a._id == req.body.id){
          appointment_request = a;
        }
        else {
          appointments_request.push(a);
        }
      });
      appointment = {
        title: appointment_request.title,
        description: req.body.description,
        start: appointment_request.start,
        end: appointment_request.end,
        date: appointment_request.date,
        meeting_user: appointment_request.from_user,
        accepted: true,
        rejected: false
      };

      console.log(appointment);

      if(req.body.mode == '2'){

        User.updateOne({_id: req.session.userId}, {appointments_request: appointments_request}).then(function(){
          console.log('done');
          ++done;
          if(done == 3){myEmitter.emit('response');}});
        var appointments = user.appointments;
        appointments.push(appointment);
        User.updateOne({_id: req.session.userId}, {appointments: appointments}).then(function(){
          console.log('done');
          ++done;
          if(done == 3){myEmitter.emit('response');}});
      }
      if(req.body.mode == '1'){
        User.updateOne({_id: req.session.userId}, {appointments_request: appointments_request}).then(function(){
          console.log('done');
          ++done;
          if(done == 2){myEmitter.emit('response');}
        });
      }
    });
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      var from = null;
      user.appointments_request.forEach(function(a) {
        if(a._id == req.body.id){
          from = a.from_user;
        }
      });
      console.log(from);
      User.findOne({username: from}).exec(function(err, user) {
        var appointments = [];
        user.appointments.forEach(function(a) {
          if(a._id == req.body.id){
            if(req.body.mode == '1'){
              a.rejected = true;
            }
            if(req.body.mode == '2'){
              a.accepted = true;
            }
          }
          appointments.push(a);
        });
        User.updateOne({username: from}, {appointments: appointments}).then(function(){
          console.log('done');
          ++done;
          if(done == 3 && req.body.mode == '2'){myEmitter.emit('response');}
          if(done == 2 && req.body.mode == '1'){myEmitter.emit('response');}});
      });
    });
    // while(1){
    //   if(done == 2 && req.body.mode == '1'){
    //     res.statusCode = 200;
    //     res.send();
    //     break;
    //   }
    //   if(done == 3 && req.body.mode == '2'){
    //     res.statusCode = 200;
    //     res.send();
    //     break;
    //   }
    // }
    myEmitter.on('response', function() {
      res.statusCode = 200;
      res.send();
    });
  });
};
