ENGINE.Won = {

  create: function() {
  },

  step: function(dt) {
  },

  pointerdown: function(event) {
    if (document.location.search.indexOf('6667') === -1) {
      ARIS.exitToDialog(90778);
    } else {
      ARIS.exitToDialog(98424);
    }
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;

    var scaling = app.height / 600;

    layer.clear("#222");

    layer
      .fillStyle('rgba(255,255,255,0.8)')
      .fillRect(0, 0, app.width, app.height);

    var textMinY = app.height * (2/5);

    layer.font((65 * scaling) + 'px sans-serif');
    layer.textAlign('center');
    layer
      .fillStyle('black')
      .fillText('You won!', app.width / 2, textMinY);

    var minX = app.width / 2 - 100 * scaling;
    var maxX = app.width / 2 + 100 * scaling;
    var minY = app.height * (4/5) - 50 * scaling;
    var maxY = app.height * (4/5) + 50 * scaling;
    layer
      .fillStyle('#222')
      .fillRect(minX, minY, maxX - minX, maxY - minY);
    layer
      .fillStyle('#2c2')
      .fillRect(minX + 5 * scaling, minY + 5 * scaling, maxX - minX - 10 * scaling, maxY - minY - 10 * scaling);
    layer.font((40 * scaling) + 'px sans-serif');
    layer.textAlign('center');
    layer
      .fillStyle('black')
      .fillText('Continue', app.width / 2, maxY - 35 * scaling);

  }

};
