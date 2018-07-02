var socket = io.connect('http://localhost:5000');

meet_error = document.querySelector('.error');
form = document.querySelector('form');
form.addEventListener('submit', function(e){
  e.preventDefault();
  var xhr = new XMLHttpRequest();
  meet_error.innerHTML = '';
  const inputs = document.querySelectorAll('form input');
  add_appointment = 'app_title='+inputs[0].value+'&app_description='+inputs[1].value+'&app_date=' + inputs[2].value + '&app_start=' + inputs[3].value + '&app_end=' + inputs[4].value + '&meeting_user=' + inputs[5].value;
  xhr.open("POST", '/appointment', true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send(add_appointment);

  xhr.onreadystatechange = function() {
    var DONE = 4;
    var OK = 200;
    if(xhr.readyState === DONE){
      if(xhr.status === OK){
        console.log(JSON.parse(xhr.responseText));
        sendInvite(JSON.parse(xhr.responseText));
        location.reload();
      }
      else{
        meet_error.innerHTML = xhr.responseText;
      }
    }
  }
});

function sendInvite(appointment) {
  socket.emit('invite-to-server', appointment);
}

function remove_app(id) {
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", '/appointment', true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.send("id="+id);
  xhr.onreadystatechange = function() {
    var DONE = 4;
    var OK = 200;
    if(xhr.readyState === DONE){
      if(xhr.status === OK){
        location.reload();
      }
    }
  }
}

var remove_appointment = document.querySelectorAll('.appointment-list .remove');
remove_appointment.forEach(function(remove) {
  remove.addEventListener('click', function(e) {
    remove_app(e.target.name);
  });
});
