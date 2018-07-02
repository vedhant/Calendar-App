var socket = require('socket.io');

module.exports = function(server){
  var io = socket(server);
  io.on('connection', function(socket) {
    console.log('made socket connection');
    socket.on('invite-to-server', function(appointment) {
      console.log(appointment);
      io.emit('invite-to-client', appointment);
    })
  });
}
