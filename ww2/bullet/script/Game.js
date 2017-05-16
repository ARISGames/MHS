/*

1171_APP_CONTROL and 1172_APP_CONTROL
{ "user_id": int
, "start_time": int timestamp
, "count": int
}

local state stores the active control message, initially null

when control message is received:
  if time is within 60 seconds and earlier than the active control:
    set active control to the incoming message
  (if same timestamp, consider earlier if user_id is earlier or same)

when we push reset:
  set active control to our user id, starting at the reset time.
  (this attempts to claim control of the machine)

every second:
  if our active control message is our user_id:
    sent the active control message out

*/

function shouldReplaceControl(curControl, newControl) {
  if (curControl === null) return true;
  if (Date.now() - curControl.start_time >= 60000) {
    return true;
  }
  if (Date.now() - newControl.start_time >= 60000) {
    return false;
  }
  if (curControl.user_id === newControl.user_id) {
    if (curControl.start_time < newControl.start_time) return true;
    if (curControl.start_time > newControl.start_time) return false;
    return curControl.count < newControl.count;
  }
  return newControl.start_time < curControl.start_time ||
    (newControl.start_time == curControl.start_time && newControl.user_id <= curControl.user_id);
}

ENGINE.Game = {

  create: function() {
    this.exitedToDialog = false;
  },

  step: function(dt) {

    var events;
    if (window.bulletEvents.length > 0) {
      events = window.bulletEvents;
      window.bulletEvents = [];
    } else {
      events = [];
    }

    var self = this;
    events.forEach(function(e){
      if (e.event === window.machine_id + '_AMMO_INCREMENT') {
        if ( window.activeControl
          && window.activeControl.user_id == window.user_id
          && Date.now() - window.activeControl.start_time < 60000 ) {
          window.activeControl.count++;
        }
      } else if (e.event === window.machine_id + '_AMMO_RESET') {
        window.activeControl = null;
        resetMachine();
      } else if (e.event === window.machine_id + '_APP_CONTROL') {
        e.data = JSON.parse(e.data);
        if (shouldReplaceControl(window.activeControl, e.data)) {
          window.activeControl = e.data;
        }
      }
    });

    if (window.activeControl && Date.now() - window.activeControl.start_time >= 60000) {
      ARIS.exitToDialog(90833);
      this.exitedToDialog = true;
    }

  },

  pointerdown: function(event) {
    var app = this.app;
    var layer = this.app.layer;
    var scaling = app.width / 300;

    if ( this.weHaveControl()
      && 10 * scaling <= event.x && event.x < 50 * scaling
      && 60 * scaling <= event.y && event.y < 100 * scaling ) {
      window.activeControl = {
        "count": 0,
        "user_id": window.user_id,
        "start_time": Date.now(),
      };
    }
    if ( 10 * scaling <= event.x && event.x < 50 * scaling
      && 110 * scaling <= event.y && event.y < 150 * scaling ) {
      window.bulletPusher.sendData(window.machine_id + '_AMMO_INCREMENT', 'x');
    }
  },

  weHaveControl: function() {
    return window.activeControl === null ||
      window.activeControl.user_id === window.user_id ||
      Date.now() - window.activeControl.start_time >= 60000;
  },

  showTime: function(elapsedMilli) {
    return (Math.max(60000 - elapsedMilli, 0) / 1000).toFixed(1);
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;

    var scaling = app.width / 300;

    layer.clear("#222");

    var message;
    if (window.activeControl === null) {
      message = 'Press Reset to start.';
    } else {
      message = 'Time: ' + this.showTime(Date.now() - window.activeControl.start_time) + ' - Bullets: ' + window.activeControl.count
    }
    layer.fillStyle('white')
      .font((20 * scaling) + 'px sans-serif')
      .fillText(message, 10 * scaling, 40 * scaling);

    if (this.weHaveControl()) {
      layer.fillStyle('red')
        .fillRect(10 * scaling, 60 * scaling, 40 * scaling, 40 * scaling)
        .fillStyle('white')
        .font((20 * scaling) + 'px sans-serif')
        .fillText('Reset', 60 * scaling, 90 * scaling);
    }

    if (true) {
      layer.fillStyle('blue')
        .fillRect(10 * scaling, 110 * scaling, 40 * scaling, 40 * scaling)
        .fillStyle('white')
        .font((20 * scaling) + 'px sans-serif')
        .fillText('Make bullet', 60 * scaling, 140 * scaling);
    }
  },

};
