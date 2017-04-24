ENGINE.Checklist = {

  create: function() {
    this.elapsed = 0;
    window.gameLevel++;
  },

  step: function(dt) {
    this.elapsed += dt;
  },

  pointerdown: function(data) {
    if (this.elapsed > 1.5) {
      this.app.setState(ENGINE.Game);
    }
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;

    layer.clear("white");
    var box = getBox(app);

    if (box.y == 0) {
      layer.fillStyle('#222').fillRect(0, 0, box.x, app.height);
      layer.fillStyle('#222').fillRect(box.x + box.width, 0, app.width - box.x - box.width, app.height);
    } else {
      layer.fillStyle('#222').fillRect(0, 0, app.width, box.y);
      layer.fillStyle('#222').fillRect(0, box.y + box.height, app.width, app.height - box.y - box.height);
    }

    layer.drawImage(app.images.clipboard, box.x, box.y, box.width, box.height);

    if (this.elapsed > 1.5) {
      layer.font(Math.floor(box.width * 0.07) + 'px sans-serif').textAlign('center').fillText('Continue >', box.x + box.width * 0.5, box.y + box.height * 0.98);
    }
  }

};