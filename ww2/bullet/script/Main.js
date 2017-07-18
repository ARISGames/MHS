var app = new PLAYGROUND.Application({

  smoothing: true,

  create: function() {

    /* things to preload */

    this.loadImage('display');

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Game);

  }

});
