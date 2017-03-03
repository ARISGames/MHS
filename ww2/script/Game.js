ENGINE.Game = {

  create: function() {
    this.started = false;
    this.elapsed = 0;
    this.offset = 0;
    this.hunger = 0;
  },

  step: function(dt) {
    if (this.started) {
      this.elapsed += dt;
      this.offset += dt / 60;
      this.hunger += dt / 20;
    }
  },

  pointerdown: function(event) {
    var app = this.app;
    if (!this.started) {
      var minX = app.width / 2 - 100;
      var maxX = app.width / 2 + 100;
      var minY = app.height / 2 - 50;
      var maxY = app.height / 2 + 50;
      if (minX <= event.x && event.x <= maxX && minY <= event.y && event.y <= maxY) {
        this.started = true;
      }
    }
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;

    layer.clear("#222");

    var backgroundWidth = app.images.background.width * (app.height / app.images.background.height);
    layer.drawImage(app.images.background, -(this.offset) * backgroundWidth, 0, backgroundWidth, app.height);

    var walkImage = app.images['Walking_man_' + (Math.floor(this.elapsed * 3) % 4 + 1)];
    var walkHeight = app.height * 0.4;
    var walkWidth = walkImage.width * (walkHeight / walkImage.height);
    layer.drawImage(walkImage, 0, app.height - walkHeight, walkWidth, walkHeight);

    var scaling = app.height / 600;
    layer.font(Math.floor(20 * scaling) + 'px sans-serif');
    layer.textAlign('left');
    layer
      .fillStyle('black')
      .fillText('Hunger Level', 20, 30 * scaling);
    layer
      .fillStyle('#999')
      .fillRect(20, 45 * scaling, app.width - 40, 30 * scaling);
    layer
      .fillStyle('#b22')
      .fillRect(20, 45 * scaling, (app.width - 40) * this.hunger, 30 * scaling);

    if (!this.started) {
      var minX = app.width / 2 - 100;
      var maxX = app.width / 2 + 100;
      var minY = app.height / 2 - 50;
      var maxY = app.height / 2 + 50;
      layer
        .fillStyle('#222')
        .fillRect(minX, minY, maxX - minX, maxY - minY);
      layer
        .fillStyle('#2c2')
        .fillRect(minX + 5, minY + 5, maxX - minX - 10, maxY - minY - 10);
      layer.font('40px sans-serif');
      layer.textAlign('center');
      layer
        .fillStyle('black')
        .fillText('START', app.width / 2, maxY - 35);
    }
  }

};
