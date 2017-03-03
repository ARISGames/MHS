ENGINE.Hunger = {

  create: function() {
  },

  step: function(dt) {
  },

  pointerdown: function(event) {
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;

    layer.clear("#222");

    layer
      .font('20px sans-serif')
      .textAlign('left')
      .fillStyle('white')
      .fillText('You got too hungry...', app.width / 2, app.height / 2);

  }

};
