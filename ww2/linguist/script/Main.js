var ARIS = {};

var app = new PLAYGROUND.Application({

  smoothing: true,

  create: function() {

    /* things to preload */

    this.loadImage('book');
    this.loadImage('paper');
    this.loadImage('japanese1');
    this.loadImage('japanese2');
    this.loadImage('japanese3');
    this.loadImage('english1');
    this.loadImage('english2');
    this.loadImage('english3');

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Game);

  }

});
