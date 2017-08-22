var ARIS = {};

var app = new PLAYGROUND.Application({

  smoothing: true,

  create: function() {

    /* things to preload */

    this.loadImage('book1');
    this.loadImage('book2');
    this.loadImage('book3');
    this.loadImage('japanese1');
    this.loadImage('japanese2');
    this.loadImage('japanese3');
    this.loadImage('english1');
    this.loadImage('english2');
    this.loadImage('english3');
    this.loadImage('right1');
    this.loadImage('right2');
    this.loadImage('right3');
    this.loadImage('wrong1');
    this.loadImage('wrong2');
    this.loadImage('wrong3');

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Game);

  }

});
