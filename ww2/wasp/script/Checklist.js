ENGINE.Checklist = {

  create: function() {
    this.elapsed = 0;
  },

  step: function(dt) {
    this.elapsed += dt;
  },

  pointerdown: function(data) {
    if (this.elapsed > 1.5) {
      if (window.gameLevel > 4) {
        if (document.location.search.indexOf('6667') === -1) {
          ARIS.exitToDialog(94542);
        } else {
          ARIS.exitToDialog(98408);
        }
      } else {
        this.app.setState(ENGINE.Game);
      }
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

    var clipboard = {};
    clipboard.width = box.width * 0.9;
    clipboard.height = clipboard.width / app.images.clipboard.width * app.images.clipboard.height;
    clipboard.x = box.x + (box.width - clipboard.width) / 2;
    clipboard.y = box.y + (box.height - clipboard.height) / 2;
    layer.drawImage(app.images.clipboard, clipboard.x, clipboard.y, clipboard.width, clipboard.height);

    if (this.elapsed > 1.5) {
      layer.font(Math.floor(box.width * 0.07) + 'px sans-serif').textAlign('center').fillText('Continue >', box.x + box.width * 0.5, box.y + box.height * 0.98);
    }

    if (window.completed[0]) {
      layer.drawImage(app.images.check, box.x + box.width * 0.17, box.y + box.height * 0.265, box.width * 0.14, box.height * 0.09);
    }
    if (window.completed[1]) {
      layer.drawImage(app.images.check, box.x + box.width * 0.17, box.y + box.height * 0.395, box.width * 0.14, box.height * 0.09);
    }
    if (window.completed[2]) {
      layer.drawImage(app.images.check, box.x + box.width * 0.17, box.y + box.height * 0.52, box.width * 0.14, box.height * 0.09);
    }
    if (window.completed[3]) {
      layer.drawImage(app.images.check, box.x + box.width * 0.17, box.y + box.height * 0.648, box.width * 0.14, box.height * 0.09);
    }
  }

};
