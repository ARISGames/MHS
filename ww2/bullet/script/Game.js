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
  if (Date.now() - curControl.start_time >= 120000) {
    return true;
  }
  if (Date.now() - newControl.start_time >= 120000) {
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
          && Date.now() - window.activeControl.start_time < 120000 ) {
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

    if (window.activeControl && Date.now() - window.activeControl.start_time >= 120000 && !this.exitedToDialog) {
      if (window.activeControl.count >= 10) {
        if (document.location.search.indexOf('6667') === -1) {
          ARIS.exitToDialog(90833);
        } else {
          ARIS.exitToDialog(98459);
        }
      } else {
        if (document.location.search.indexOf('6667') === -1) {
          ARIS.exitToDialog(95916);
        } else {
          ARIS.exitToDialog(98412);
        }
      }
      this.exitedToDialog = true;
    }

  },

  pointerdown: function(event) {
    var app = this.app;
    var layer = this.app.layer;
    var display = this.displayBox();

    var startX = display.x + display.width * (103/566);
    var startY = display.y + display.height * (606/792);
    var startW = display.width * (363/566);
    var startH = display.height * (107/792);

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
      Date.now() - window.activeControl.start_time >= 120000;
  },

  showTime: function(elapsedMilli) {
    var fullSeconds = Math.max(120000 - elapsedMilli, 0) / 1000;
    var minutes = Math.floor(fullSeconds / 60);
    var seconds = fullSeconds - minutes * 60;
    var zeroPad = (seconds < 10 ? '0' : '')
    return minutes + ':' + zeroPad + seconds.toFixed(1);
  },

  displayBox: function() {
    var app = this.app;
    var display = {};
    if (app.width / app.height > app.images.display.width / app.images.display.height) {
      // window is wider than display. boxes on left/right
      display.height = app.height;
      display.width = app.height / app.images.display.height * app.images.display.width;
      display.x = (app.width - display.width) / 2;
      display.y = 0;
      display.backgroundColor = 'black';
    } else {
      // window is taller than display. extend green to bottom
      display.width = app.width;
      display.height = app.width / app.images.display.width * app.images.display.height;
      display.x = 0;
      display.y = 0;
      display.backgroundColor = 'rgb(189,211,200)';
    }
    return display;
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;

    var display = this.displayBox();
    layer.clear(display.backgroundColor);
    layer.drawImage(app.images.display, display.x, display.y, display.width, display.height);

    var displayTime = this.showTime(window.activeControl === null ? 0 : Date.now() - window.activeControl.start_time);
    var displayCount = (window.activeControl === null ? '0' : window.activeControl.count);
    layer.font(Math.floor(display.height * 0.12) + 'px sans-serif')
      .textAlign('center')
      .fillStyle('black')
      .fillText(displayTime, display.x + display.width * 0.5, display.y + display.height * 0.455)
      .fillText(displayCount, display.x + display.width * 0.5, display.y + display.height * 0.69);

    if (window.activeControl !== null) {
      layer.fillStyle('rgb(255,210,0)')
        .fillRect(
          display.x + display.width * 0.25,
          display.y + display.height * 0.79,
          display.width * 0.5,
          display.height * 0.1,
        );
    }
  },

};
