var app = new PLAYGROUND.Application({

  smoothing: false,

  create: function() {

    /* things to preload */

    this.loadImage("winglevel");
    this.loadImage("altimeter");
    this.loadImage("stick_up");
    this.loadImage("stick_down");
    this.loadImage("stick_left");
    this.loadImage("stick_right");
    this.loadImage("clouds.jpg");
    this.loadImage("pilot_bad.jpg");
    this.loadImage("pilot_good.jpg");

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Game);

  }

});
