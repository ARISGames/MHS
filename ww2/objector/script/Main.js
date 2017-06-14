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
    this.loadImage('icon_cinema');
    this.loadImage('icon_donut');
    this.loadImage('icon_guitar');
    this.loadImage('icon_popcorn');
    this.loadImage('icon_record');
    this.loadImage('icon_sandwich');
    this.loadImage('shop_art');
    this.loadImage('shop_bakery');
    this.loadImage('shop_barber');
    this.loadImage('shop_bookstore');
    this.loadImage('shop_boutique');
    this.loadImage('shop_coffee');
    this.loadImage('shop_fastfood');
    this.loadImage('shop_flowers');
    this.loadImage('shop_fruits');
    this.loadImage('shop_icecream');
    this.loadImage('shop_market');
    this.loadImage('shop_music');
    this.loadImage('shop_pets');
    this.loadImage('shop_pizza');
    this.loadImage('shop_vegetables');
    this.loadImage('shop_watch');

  },

  ready: function() {

    /* after preloading route events to the game state */

    this.setState(ENGINE.Game);

  }

});
