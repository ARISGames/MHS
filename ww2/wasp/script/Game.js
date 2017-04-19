function getBox(app) {
  if (app.width / app.height > 9 / 16) {
    // window is wider than ipod. boxes on left/right
    var w = app.height * (9 / 16);
    return {
      width: w,
      height: app.height,
      x: (app.width - w) / 2,
      y: 0,
    };
  } else {
    // window is taller than ipod. boxes on top/bottom
    var h = app.width * (16 / 9);
    return {
      width: app.width,
      height: h,
      x: 0,
      y: (app.height - h) / 2,
    };
  }
}

ENGINE.Game = {

  create: function() {

    this.position = 'center';
    this.elapsed = 0;
    this.winglevel = 0;
    this.altitude = 0;

  },

  step: function(dt) {

    if (this.position == 'down') {
      this.altitude += dt * 1200;
    } else if (this.position == 'up') {
      this.altitude -= dt * 1200;
    }

    if (this.altitude < 0) this.altitude = 0;
    if (this.altitude > 9500) this.altitude = 9500;

    if (this.position == 'left') {
      this.winglevel -= dt * 0.7;
    } else if (this.position == 'right') {
      this.winglevel += dt * 0.7;
    } else {
      if      (this.winglevel > 0) this.winglevel -= Math.min( this.winglevel, dt * 0.4);
      else if (this.winglevel < 0) this.winglevel += Math.min(-this.winglevel, dt * 0.4);
    }

    if (this.altitude < 0) this.altitude = 0;
    if (this.altitude > 9500) this.altitude = 9500;
    if (this.winglevel < -1) this.winglevel = -1;
    if (this.winglevel > 1) this.winglevel = 1;

  },

  handlepointer: function(data) {
    var box = getBox(this.app);
    var x = (data.x - box.x) / box.width;
    var y = (data.y - box.y) / box.height;

    if (45/415 <= x && x <= 156/415 && 524/739 <= y && y <= 620/739) {
      this.position = 'left';
    } else if (267/415 <= x && x <= 376/415 && 524/739 <= y && y <= 620/739) {
      this.position = 'right';
    } else if (167/415 <= x && x <= 251/415 && 424/739 <= y && y <= 514/739) {
      this.position = 'up';
    } else if (167/415 <= x && x <= 251/415 && 630/739 <= y && y <= 722/739) {
      this.position = 'down';
    } else if (167/415 <= x && x <= 251/415 && 528/739 <= y && y <= 618/739) {
      this.position = 'center';
    }
  },

  pointerdown: function(data) {
    this.isdown = true;
    this.handlepointer(data);
  },

  pointerup: function(data) {
    this.isdown = false;
  },

  pointermove: function(data) {
    if (this.isdown) this.handlepointer(data);
  },

  render: function() {

    var app = this.app;
    var layer = this.app.layer;

    layer.clear("#222");

    var box = getBox(app);
    layer.fillStyle('#333').fillRect(box.x, box.y, box.width, box.height);

    layer.fillStyle('rgb(207,226,243)')
      .fillRect(box.x + box.width * 0.235, box.y + box.height * (0.71 + 0.03), box.width * 0.8 * 0.66, box.width * 0.2 * 0.66)
      .fillRect(box.x + box.width * 0.435, box.y + box.height * (0.60 + 0.03), box.width * 0.2 * 0.66, box.width * 0.8 * 0.66);

    switch (this.position) {
      case 'center':
        layer.beginPath()
          .fillStyle('rgb(165,202,149)')
          .strokeStyle('black')
          .lineWidth(box.width * 0.005)
          .arc(box.x + box.width * 0.5, box.y + box.height * (0.748 + 0.03), box.width * 0.09, 0, 2 * Math.PI, false)
          .fill()
          .stroke();
        break;
      case 'up':
        layer.drawImage(app.images.stick_up, box.x + box.width * (232/520), box.y + box.height * ((504/924) + 0.03), box.width * (59/520), box.height * (194/924));
        break;
      case 'down':
        layer.drawImage(app.images.stick_down, box.x + box.width * (232/520), box.y + box.height * ((671/924) + 0.03), box.width * (59/520), box.height * (194/924));
        break;
      case 'left':
        layer.drawImage(app.images.stick_left, box.x + box.width * (82/520), box.y + box.height * ((661/924) + 0.03), box.height * (194/924), box.width * (59/520));
        break;
      case 'right':
        layer.drawImage(app.images.stick_right, box.x + box.width * (244/520), box.y + box.height * ((661/924) + 0.03), box.height * (194/924), box.width * (59/520));
        break;
    }

    var meterWidth = box.width * 0.425;
    var meterHeight = meterWidth * (app.images.winglevel.height / app.images.winglevel.width);
    layer.drawImage(app.images.winglevel, box.x + box.width * 0.05, box.y + box.height * 0.3, meterWidth, meterHeight);
    layer.drawImage(app.images.altimeter, box.x + box.width * 0.525, box.y + box.height * 0.3, meterWidth, meterHeight);

    var altimeter = {x: box.x + box.width * (306/414), y: box.y + box.height * (310/739)};
    var altirads = (this.altitude / 10000) * 2 * Math.PI - 0.5 * Math.PI;
    var altiradius = box.width * (58/414);
    layer.strokeStyle('black')
      .lineWidth(box.width * 0.012)
      .beginPath()
      .moveTo(altimeter.x, altimeter.y)
      .lineTo(altimeter.x + Math.cos(altirads) * altiradius, altimeter.y + Math.sin(altirads) * altiradius)
      .stroke();

    var winglevel = {x: box.x + box.width * (110/414), y: box.y + box.height * (318/739)};
    var wingrads = this.winglevel * 0.25 * Math.PI - 0.5 * Math.PI;
    var wingradiusX = box.width * (58/414);
    var wingradiusY = box.height * (48/739);
    layer.strokeStyle('black')
      .lineWidth(box.width * 0.012)
      .beginPath()
      .moveTo(winglevel.x, winglevel.y)
      .lineTo(winglevel.x + Math.cos(wingrads) * wingradiusX, winglevel.y + Math.sin(wingrads) * wingradiusY)
      .stroke();

  }

};
