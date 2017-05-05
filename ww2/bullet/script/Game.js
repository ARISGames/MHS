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
  if (Date.now() - newControl.start_time >= 60000) {
    return false;
  }
  return newControl.start_time < curControl.start_time ||
    (newControl.start_time == curControl.start_time && newControl.user_id <= curControl.user_id);
}

ENGINE.Game = {

  create: function() {
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
      console.log(e);
      switch (e.event) {
        case '1171_AMMO_INCREMENT':
          if (window.activeControl1 && window.activeControl1.user_id == window.user_id) {
            window.activeControl1.count++;
          }
          break;
        case '1172_AMMO_INCREMENT':
          if (window.activeControl2 && window.activeControl2.user_id == window.user_id) {
            window.activeControl2.count++;
          }
          break;
        case '1171_AMMO_RESET':
          window.activeControl1 = null;
          break;
        case '1172_AMMO_RESET':
          window.activeControl2 = null;
          break;
        case '1171_APP_CONTROL':
          e.data = JSON.parse(e.data);
          if (shouldReplaceControl(window.activeControl1, e.data)) {
            window.activeControl1 = e.data;
          }
          break;
        case '1172_APP_CONTROL':
          e.data = JSON.parse(e.data);
          if (shouldReplaceControl(window.activeControl2, e.data)) {
            window.activeControl2 = e.data;
          }
          break;
      }
    });

  },

  pointerdown: function(event) {
    if (10 <= event.x && event.x < 90 && 10 <= event.y && event.y <= 90) {
      window.activeControl1 = {
        "count": 0,
        "user_id": window.user_id,
        "start_time": Date.now(),
      };
    }
    if (100 <= event.x && event.x < 180 && 10 <= event.y && event.y <= 90) {
      window.activeControl2 = {
        "count": 0,
        "user_id": window.user_id,
        "start_time": Date.now(),
      };
    }
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;

    layer.clear("#222");

    layer.fillStyle('white')
      .font('20px sans-serif')
      .fillText('Ammo 1: ' + JSON.stringify(window.activeControl1), 10, 140);

    layer.fillStyle('white')
      .font('20px sans-serif')
      .fillText('Ammo 2: ' + JSON.stringify(window.activeControl2), 10, 180);

    layer.fillStyle('white')
      .fillRect(10, 10, 80, 80)
      .fillRect(100, 10, 80, 80);
  },

};
