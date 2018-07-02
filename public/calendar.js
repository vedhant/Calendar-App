user = JSON.parse(document.getElementById('user').innerHTML);
switch_month = document.querySelectorAll('#calendar-head i');
left_month = switch_month[0];
right_month = switch_month[1];
appointments = user.appointments;
var appointments_today = [];


var d = new Date();
today_date = parseInt(String(d)[8]+String(d)[9]);
var month_name = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var month = d.getMonth();
today_month = month;
var year = d.getFullYear();
today_year = year;
var first_date = month_name[month] + " " + 1 + " " + year;
var tmp = new Date(first_date).toDateString();
var first_day = tmp.substring(0, 3);
var day_name = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
var day_no = day_name.indexOf(first_day);
var days = new Date(year, month+1, 0).getDate();

var calendar = get_calendar(day_no, days);
document.getElementById("calendar-month-year").innerHTML = month_name[month]+" "+year;
document.getElementById("calendar-dates").appendChild(calendar);

function get_calendar(day_no, days, today = true) {
  apps = filter_by_month_year(month, year);
  var table = document.createElement('table');
  var tr = document.createElement('tr');
  for(var c=0; c<7; ++c){
    var td = document.createElement('td');
    td.classList.add('week-name');
    td.innerHTML = day_name[c];
    tr.appendChild(td);
  }
  table.appendChild(tr);

  var tr = document.createElement('tr');
  var c;
  for(c=0; c<7; ++c){
    if(c == day_no){
      break;
    }
    var td = document.createElement('td');
    td.classList.add('day');
    td.innerHTML = "";
    tr.appendChild(td);
  }
  var count = 1;
  for(; c<7; ++c){
    var td = document.createElement('td');
    td.classList.add('day');
    if(count == today_date && today){
      td.setAttribute('id', 'today');
    }
    var span = document.createElement('span');
    span.classList.add('date');
    span.innerHTML = count;
    td.appendChild(span);
    apps.forEach(function(a) {
      if(check_app_date(a, count)){
        if(count == today_date && today && blink(a)){
          var span_app = document.createElement('span');
          span_app.classList.add('appointment_title');
          var blink_element = document.createElement('blink');
          blink_element.innerHTML = a.title;
          span_app.appendChild(blink_element);
          td.appendChild(span_app);
        }
        else{
          var span_app = document.createElement('span');
          span_app.classList.add('appointment_title');
          span_app.innerHTML = a.title;
          td.appendChild(span_app);
        }
      }
    });
    count++;
    tr.appendChild(td);
  }
  table.appendChild(tr);

  for(var r=3; r<=7; ++r){
    var tr = document.createElement('tr');
    for(var c=0; c<7; ++c){
      if(count>days){
        table.appendChild(tr);
        return table;
      }
      var td = document.createElement('td');
      td.classList.add('day');
      if(count == today_date && today){
        td.setAttribute('id', 'today');
      }
      var span = document.createElement('span');
      span.classList.add('date');
      span.innerHTML = count;
      td.appendChild(span);
      apps.forEach(function(a) {
        if(check_app_date(a, count)){
          if(count == today_date && today && blink(a)){
            var span_app = document.createElement('span');
            span_app.classList.add('appointment_title');
            var blink_element = document.createElement('blink');
            blink_element.innerHTML = a.title;
            span_app.appendChild(blink_element);
            td.appendChild(span_app);
          }
          else{
            var span_app = document.createElement('span');
            span_app.classList.add('appointment_title');
            span_app.innerHTML = a.title;
            td.appendChild(span_app);
          }
        }
      });
      count++;
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

left_month.addEventListener('click', function() {
  appointments_today = null;
  if(month == 0){
    month = 11;
    --year;
  }
  else{
    month--;
  }
  if(month == today_month && year == today_year){
    today = true;
  }
  else{
    today = false;
  }
  first_date = month_name[month] + " " + 1 + " " + year;
  tmp = new Date(first_date).toDateString();
  first_day = tmp.substring(0, 3);
  day_no = day_name.indexOf(first_day);
  days = new Date(year, month+1, 0).getDate();

  calendar = get_calendar(day_no, days, today);
  document.getElementById("calendar-month-year").innerHTML = month_name[month]+" "+year;
  document.getElementById("calendar-dates").innerHTML = "";
  document.getElementById("calendar-dates").appendChild(calendar);
  enable_click();
});

right_month.addEventListener('click', function() {
  appointments_today = null;
  if(month == 11){
    month = 0;
    ++year;
  }
  else{
    month++;
  }
  if(month == today_month && year == today_year){
    today = true;
  }
  else{
    today = false;
  }
  first_date = month_name[month] + " " + 1 + " " + year;
  tmp = new Date(first_date).toDateString();
  first_day = tmp.substring(0, 3);
  day_no = day_name.indexOf(first_day);
  days = new Date(year, month+1, 0).getDate();

  calendar = get_calendar(day_no, days, today);
  document.getElementById("calendar-month-year").innerHTML = month_name[month]+" "+year;
  document.getElementById("calendar-dates").innerHTML = "";
  document.getElementById("calendar-dates").appendChild(calendar);
  enable_click();
});

function filter_by_month_year(month, year) {
  var a = [];
  appointments.forEach(function(app) {
    date = app.date;
    m = parseInt(date[5]+date[6]) - 1;
    y = parseInt(date[0]+date[1]+date[2]+date[3]);
    if(m==month && y==year && app.accepted){
      a.push(app);
    }
  });
  return a;
}

function check_app_date(app, date) {
  d = parseInt(app.date[8]+app.date[9]);
  if(date == d){
    return true;
  }else{
    return false;
  }
}

function enable_click() {
  var day_tags = document.querySelectorAll('.day');
  day_tags.forEach(function(day_tag) {
    day_tag.addEventListener('click', function(e) {
      var date_clicked = e.target;
      if(e.target.tagName == 'SPAN'){
        date_clicked = e.target.parentElement;
      }
      var date_clicked = parseInt(date_clicked.querySelector('.date').innerHTML);
      if(date_clicked < 10){
        date_clicked = '0' + String(date_clicked);
      }
      actual_month = month + 1;
      if(actual_month < 10){
        actual_month = '0'+String(actual_month);
      }
      date_clicked = year+'-'+actual_month+'-'+date_clicked;
      var xhr = new XMLHttpRequest();
      url = '/day?'+'date='+date_clicked;
      xhr.open("POST", '/day', true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send('date='+date_clicked);
      xhr.onreadystatechange = function() {
        var DONE = 4;
        var OK = 200;
        if(xhr.readyState === DONE){
          if(xhr.status === OK){
            location.href = url;
          }
        }
      }
    });
  });

}

function blink(a) {
  console.log(a);
  var d = new Date();
  if(month == d.getMonth() && year == d.getFullYear()){
    var hour_now = String(d.getHours());
    var hour = a.start[0]+a.start[1];
    console.log(hour_now);
    if(hour_now == hour){
      return true;
    }
    else{
      return false;
    }
  }
  return false;
}

enable_click();
