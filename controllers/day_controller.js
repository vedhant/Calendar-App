var bodyParser = require('body-parser');
var User = require('../models/user');

var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = function(app, requiresLogin) {
  app.get('/day', requiresLogin, function(req, res) {
    var date = req.query.date;
    var year = date[0] + date[1] + date[2] + date[3];
    var month_name = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var month_index = parseInt(date[5] + date[6])-1;
    var month = month_name[month_index];
    var day = date[8] + date[9];
    var appointments = [];
    User.findOne({_id: req.session.userId}).exec(function(err, user) {
      user.appointments.forEach(function(a) {
        if(a.date == date && a.accepted){
          appointments.push(a);
        }
      });
      res.statusCode = 200;
      return res.render('day', {appointments: appointments, year: year, month: month, day: day});
    });
  });

  app.post('/day', urlencodedParser, function(req, res) {
    res.statusCode = 200;
    res.send();
  });
};
