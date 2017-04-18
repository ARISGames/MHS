var app = new PLAYGROUND.Application({

  smoothing: false,

  create: function() {

    /* things to preload */

    this.loadImage("winglevel.jpg");
    this.loadImage("altimeter");
    this.loadImage("flightstick");

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Game);

  }

});
