var socket = io.connect('http://localhost:5000');

var appointments_request = [];
appointments_request_list = document.querySelector('#appointments_request_list ul');
var username = document.querySelector('#username').innerHTML;

var xhr = new XMLHttpRequest();

xhr.open("POST", '/invites', true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.send();
xhr.onreadystatechange = function() {
  var DONE = 4;
  var OK = 200;
  if(xhr.readyState === DONE){
    if(xhr.status === OK){
      appointments_request = JSON.parse(xhr.responseText);
      appointments_request.forEach(function(a) {
        addAppRequest(a);
        apps_id = document.querySelectorAll('.app_id');
        apps_id.forEach(function(Id) {
          Id.style.display = "none";
        });
      });
    }
  }
}

function addAppRequest(appointment) {
  li = document.createElement('li');
  li.classList.add('appointment_request');
  div = document.createElement('div');
  span = document.createElement('span');
  span.classList.add('app_id');
  span.innerHTML = appointment._id;
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_headers');
  span.innerHTML = 'You received an appointment from ';
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_from');
  span.innerHTML = appointment.from_user;
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_headers');
  span.innerHTML = 'Title ';
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_title');
  span.innerHTML = appointment.title;
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_headers');
  span.innerHTML = 'Appointment on ';
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_date');
  span.innerHTML = appointment.date;
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_headers');
  span.innerHTML = 'From ';
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_start');
  span.innerHTML = appointment.start;
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_headers');
  span.innerHTML = 'To ';
  div.appendChild(span);
  span = document.createElement('span');
  span.classList.add('app_req_end');
  span.innerHTML = appointment.end;
  div.appendChild(span);
  li.appendChild(div);
  desc = document.createElement('input');
  desc.setAttribute('type', 'text');
  desc.setAttribute('placeholder', 'Enter description');
  div.appendChild(desc);
  li.appendChild(desc);
  req_accept = document.createElement('button');
  req_accept.classList.add('accept_req');
  req_accept.innerHTML = 'accept';
  li.appendChild(req_accept);
  req_reject = document.createElement('button');
  req_reject.classList.add('reject_req');
  req_reject.innerHTML = 'reject';
  li.appendChild(req_reject);

  appointments_request_list.appendChild(li);
}

socket.on('invite-to-client', function(appointment) {
  if(username == appointment.meeting_user){
    addAppRequest(appointment);
    apps_id = document.querySelectorAll('.app_id');
    apps_id.forEach(function(Id) {
      Id.style.display = "none";
    });
  }
});

appointments_request_list.addEventListener('click', function(e) {
  var mode = 0;
  var app_id = 0;
  var desc = '';
  if(e.target.className == 'reject_req'){
    var li = e.target.parentElement;
    app_id = li.querySelector('.app_id').innerHTML;
    desc = li.querySelector('input').innerHTML;
    mode = 1;
  }
  if(e.target.className == 'accept_req'){
    var li = e.target.parentElement;
    app_id = li.querySelector('.app_id').innerHTML;
    desc = li.querySelector('input').value;
    mode = 2;
  }
  if(mode != 0){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", '/invites', true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send('id='+app_id+'&mode='+mode+'&description='+desc);
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
});

appointments_request_list.addEventListener('mouseover',function(e) {
  if(e.target.tagName != 'UL'){
    var parent_li = e.target;
    while(parent_li.tagName != 'LI'){
      parent_li = parent_li.parentElement;
    }
    button = parent_li.querySelectorAll('button');
    button[0].style.background = 'rgba(217, 55, 50, 0.7)';
    button[0].style.color = '#EBEDF3';
    button[1].style.background = 'rgba(217, 55, 50, 0.7)';
    button[1].style.color = '#EBEDF3';
  }
  if(e.target.tagName == 'BUTTON'){
    e.target.style.background = 'rgba(217, 55, 50, 1)';
  }
  // e.target.style.background = 'rgba(41, 56, 76, 1)';
});

appointments_request_list.addEventListener('mouseout', function(e) {
  if(e.target.tagName != 'UL'){
    var parent_li = e.target;
    while(parent_li.tagName != 'LI'){
      parent_li = parent_li.parentElement;
    }
    button = parent_li.querySelectorAll('button');
    button[0].style.background = '';
    button[0].style.color = '#2C3339';
    button[1].style.background = '';
    button[1].style.color = '#2C3339';
  }
});
