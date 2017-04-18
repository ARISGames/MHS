ENGINE.Game = {

  create: function() {

    this.position = 'center';
    this.elapsed = 0;

  },

  step: function(dt) {

    /* update your game logic here */
    this.elapsed += dt;
    switch (Math.floor(this.elapsed * 2) % 5) {
      case 0:
        this.position = 'center';
        break;
      case 1:
        this.position = 'left';
        break;
      case 2:
        this.position = 'right';
        break;
      case 3:
        this.position = 'up';
        break;
      case 4:
        this.position = 'down';
        break;
    }

  },

  render: function() {

    var app = this.app;
    var layer = this.app.layer;

    layer.clear("#222");

    // layer.drawImage(app.images.winglevel, 0, 0, 100, 100);

    var box;
    if (app.width / app.height > 9 / 16) {
      // window is wider than ipod. boxes on left/right
      var w = app.height * (9 / 16);
      box = {
        width: w,
        height: app.height,
        x: (app.width - w) / 2,
        y: 0,
      };
    } else {
      // window is taller than ipod. boxes on top/bottom
      var h = app.width * (16 / 9);
      box = {
        width: app.width,
        height: h,
        x: 0,
        y: (app.height - h) / 2,
      };
    }
    layer.fillStyle('#333').fillRect(box.x, box.y, box.width, box.height);

    layer.fillStyle('rgb(207,226,243)')
      .fillRect(box.x + box.width * 0.235, box.y + box.height * 0.71, box.width * 0.8 * 0.66, box.width * 0.2 * 0.66)
      .fillRect(box.x + box.width * 0.435, box.y + box.height * 0.60, box.width * 0.2 * 0.66, box.width * 0.8 * 0.66);

    switch (this.position) {
      case 'center':
        layer.fillStyle('rgb(165,202,149)')
          .strokeStyle('black')
          .lineWidth(box.width * 0.005)
          .arc(box.x + box.width * 0.5, box.y + box.height * 0.748, box.width * 0.09, 0, 2 * Math.PI, false)
          .fill()
          .stroke();
        break;
      case 'up':
        layer.drawImage(app.images.stick_up, box.x + box.width * (232/520), box.y + box.height * (504/924), box.width * (59/520), box.height * (194/924));
        break;
      case 'down':
        layer.drawImage(app.images.stick_down, box.x + box.width * (232/520), box.y + box.height * (671/924), box.width * (59/520), box.height * (194/924));
        break;
      case 'left':
        layer.drawImage(app.images.stick_left, box.x + box.width * (82/520), box.y + box.height * (661/924), box.height * (194/924), box.width * (59/520));
        break;
      case 'right':
        layer.drawImage(app.images.stick_right, box.x + box.width * (244/520), box.y + box.height * (661/924), box.height * (194/924), box.width * (59/520));
        break;
    }

  }

};
