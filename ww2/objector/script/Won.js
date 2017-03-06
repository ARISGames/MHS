ENGINE.Won = {

  create: function() {
  },

  step: function(dt) {
  },

  pointerdown: function(event) {
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;

    var scaling = app.height / 600;

    layer.clear("#222");

    layer
      .font((30 * scaling) + 'px sans-serif')
      .textAlign('center')
      .fillStyle('white')
      .fillText('You won!', app.width / 2, app.height / 2);

  }

};
