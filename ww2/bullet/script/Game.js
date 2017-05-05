ENGINE.Game = {

  create: function() {
    this.ammo1 = 0;
    this.ammo2 = 0;
  },

  step: function(dt) {

    /* update your game logic here */

    var events;
    if (window.bulletEvents.length > 0) {
      events = window.bulletEvents;
      window.bulletEvents = [];
    } else {
      events = [];
    }

    var self = this;
    events.forEach(function(e){
      console.log(e);
      switch (e.event) {
        case '1171_AMMO_INCREMENT':
          self.ammo1++;
          break;
        case '1172_AMMO_INCREMENT':
          self.ammo2++;
          break;
        case '1171_AMMO_RESET':
          self.ammo1 = 0;
          break;
        case '1172_AMMO_RESET':
          self.ammo2 = 0;
          break;
      }
    });

  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;

    layer.clear("#222");

    layer.fillStyle('white')
      .font('20px sans-serif')
      .fillText('Ammo 1: ' + this.ammo1, 10, 70);

    layer.fillStyle('white')
      .font('20px sans-serif')
      .fillText('Ammo 2: ' + this.ammo2, 10, 140);
  }

};
