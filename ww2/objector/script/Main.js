var ARIS = {};

var app = new PLAYGROUND.Application({

  smoothing: true,

  create: function() {

    /* things to preload */

    for (var i = 0; i < 24; i++) {
        this.loadImage('walking-v2-' + i);
    }
    this.loadImage('background.jpg');
    this.loadImage('icon_apple');
    this.loadImage('icon_book');
    this.loadImage('icon_burger');
    this.loadImage('icon_candy');
    this.loadImage('icon_chocolate');
    this.loadImage('icon_cinema');
    this.loadImage('icon_donut');
    this.loadImage('icon_guitar');
    this.loadImage('icon_popcorn');
    this.loadImage('icon_record');
    this.loadImage('icon_sandwich');
    this.loadImage('icon_shake');

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Game);

  }

});
