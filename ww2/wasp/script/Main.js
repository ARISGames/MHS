var ARIS = {};
ARIS.ready = function(){
  var app = new PLAYGROUND.Application({

    smoothing: true,

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
      this.loadImage("clipboard");
      this.loadImage("check");

    },

    ready: function() {

      /* after preloading route events to the game state */

      this.setState(ENGINE.Checklist);

    }

  });
};
//ARIS.ready();
