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

    if (window.activeControl && Date.now() - window.activeControl.start_time >= 60000 && !this.exitedToDialog) {
      if (window.activeControl.count >= 5) {
        ARIS.exitToDialog(90833);
      } else {
        ARIS.exitToDialog(95916);
      }
      this.exitedToDialog = true;
    }

  },

  pointerdown: function(event) {
    var app = this.app;
    var layer = this.app.layer;
    var scaling = app.height / 900;

    var startX = 20 * scaling;
    var startY = app.height * (2/3) + 20 * scaling;
    var startW = app.width - 40 * scaling;
    var startH = app.height * (1/3) - 40 * scaling;

    if ( window.activeControl === null
      && startX <= event.x && event.x < startX + startW
      && startY <= event.y && event.y < startY + startH ) {
      window.activeControl = {
        "count": 0,
        "user_id": window.user_id,
        "start_time": Date.now(),
      };
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

    var scaling = app.height / 900;

    layer.clear("#222");

    layer.fillStyle('white')
      .fillRect(20 * scaling, 20 * scaling, app.width - 40 * scaling, app.height * (1/3) - 40 * scaling)
      .fillRect(20 * scaling, app.height * (1/3) + 20 * scaling, app.width - 40 * scaling, app.height * (1/3) - 40 * scaling)
      .fillStyle(window.activeControl === null ? '#a33' : '#666')
      .fillRect(20 * scaling, app.height * (2/3) + 20 * scaling, app.width - 40 * scaling, app.height * (1/3) - 40 * scaling);

    layer.font(Math.floor(app.height * (1/7)) + 'px sans-serif');
    if (window.activeControl === null) {
      layer.fillStyle('black')
        .fillText(this.showTime(0), 40 * scaling, app.height * (1/3 - 1/11))
        .fillText('0', 40 * scaling, app.height * (2/3 - 1/11))
        .fillStyle('white')
        .fillText('START', 40 * scaling, app.height * (3/3 - 1/11));
    } else {
      layer.fillStyle('black')
        .fillText(this.showTime(Date.now() - window.activeControl.start_time), 40 * scaling, app.height * (1/3 - 1/11))
        .fillText(window.activeControl.count, 40 * scaling, app.height * (2/3 - 1/11));
    }

    layer.font(Math.floor(app.height * (1/16)) + 'px sans-serif');
    layer.fillStyle('#aaa')
      .fillText('TIME', 40 * scaling, app.height * (0/3 + 1/10))
      .fillText('BULLETS', 40 * scaling, app.height * (1/3 + 1/10));
  },

};
