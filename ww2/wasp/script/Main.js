var ARIS = {};

var app = new PLAYGROUND.Application({

  smoothing: true,

  create: function() {

    /* things to preload */

    this.loadImage("gauge_left");
    this.loadImage("gauge_left_spinner");
    this.loadImage("gauge_right");
    this.loadImage("gauge_right_spinner");
    this.loadImage("stick_up");
    this.loadImage("stick_down");
    this.loadImage("stick_left");
    this.loadImage("stick_right");
    this.loadImage("stick_center");
    this.loadImage("clipboard");
    this.loadImage("check");
    this.loadImage("cockpit");
    this.loadImage("light_green");
    this.loadImage("light_orange");
    this.loadImage("light_red");
    this.loadImage("sky.jpg");

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Checklist);

  }

});
