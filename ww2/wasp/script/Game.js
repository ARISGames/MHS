ENGINE.Game = {

  create: function() {
    this.increaseLevel();

    this.position = 'center';
    this.elapsed = 0;
    this.winglevel = 0;
    this.altitude = 1500;

    this.cloudX = 0;
    this.cloudY = 0;

    this.pilot = 'good';

    this.testing = null;
    this.testTime = 0;
  },

  increaseLevel: function() {
    window.gameLevel++;
    switch (window.gameLevel) {
      case 1:
        this.dialogs = [
          "First, practice your controls and learn how they work. Press Continue when you're ready to start.",
          "_TEST_Now you try. Go up to 7000 feet and hold it there.",
          "Well done!",
        ]
        break;
      case 2:
        this.dialogs = [
          "_TEST_Next, turn left. Push the lever right. Hold it when the pointer is all the way to the left.",
          "Good job!",
        ]
        break;
      case 3:
        this.dialogs = [
          "_TEST_Now, turn right, and hold it there.",
          "Good work!",
        ]
        break;
      case 4:
        this.dialogs = [
          "_TEST_Last one. Go down to 5000 feet and hold it there.",
          "Good work!",
        ]
        break;
    }
    this.startTest();
  },

  step: function(dt) {

    var prevAltitude = this.altitude;

    if (this.position == 'down') {
      this.altitude += dt * 1200;
    } else if (this.position == 'up') {
      this.altitude -= dt * 1200;
    }

    if (this.altitude < 0) this.altitude = 0;
    if (this.altitude > 9500) this.altitude = 9500;

    this.cloudY += this.altitude - prevAltitude;

    if (this.position == 'right') {
      this.winglevel -= dt * 0.7;
    } else if (this.position == 'left') {
      this.winglevel += dt * 0.7;
    } else {
      if      (this.winglevel > 0) this.winglevel -= Math.min( this.winglevel, dt * 0.4);
      else if (this.winglevel < 0) this.winglevel += Math.min(-this.winglevel, dt * 0.4);
    }

    if (this.altitude < 0) this.altitude = 0;
    if (this.altitude > 9500) this.altitude = 9500;
    if (this.winglevel < -1) this.winglevel = -1;
    if (this.winglevel > 1) this.winglevel = 1;

    this.cloudX += this.winglevel * dt;

    if (this.testing) {
      if (this.testPassing()) {
        this.testTime += dt;
      } else {
        this.testTime = 0;
      }
      if (this.testTime > 2) {
        this.testTime = 0;
        this.testing = null;
        this.advanceLine();
      }
    }

  },

  handlepointer: function(data) {
    var box = getBox(this.app);
    var x = (data.x - box.x) / box.width;
    var y = (data.y - box.y) / box.height;

    if (45/415 <= x && x <= 156/415 && 524/739 + 0.05 <= y && y <= 620/739 + 0.05) {
      this.position = 'left';
      return;
    } else if (267/415 <= x && x <= 376/415 && 524/739 + 0.05 <= y && y <= 620/739 + 0.05) {
      this.position = 'right';
      return;
    } else if (167/415 <= x && x <= 251/415 && 424/739 + 0.05 <= y && y <= 514/739 + 0.05) {
      this.position = 'up';
      return;
    } else if (167/415 <= x && x <= 251/415 && 630/739 + 0.05 <= y && y <= 722/739 + 0.05) {
      this.position = 'down';
      return;
    } else if (167/415 <= x && x <= 251/415 && 528/739 + 0.05 <= y && y <= 618/739 + 0.05) {
      this.position = 'center';
      return;
    }
  },

  pointerdown: function(data) {
    this.isdown = true;

    var box = getBox(this.app);
    var x = (data.x - box.x) / box.width;
    var y = (data.y - box.y) / box.height;

    if (0 <= x && x <= 1 && 0 <= y && y <= 0.27 && !(this.testing)) {
      this.advanceLine();
      return;
    }

    this.handlepointer(data);
  },

  advanceLine: function() {
    this.dialogs = this.dialogs.slice(1);
    if (this.dialogs.length == 0) {
      window.completed[window.gameLevel - 1] = true;
      this.increaseLevel();
      this.app.setState(ENGINE.Checklist);
    }
    this.startTest();
  },

  startTest: function() {
    if (this.dialogs.length > 0 && this.dialogs[0].slice(0, 6) === '_TEST_') {
      this.dialogs[0] = this.dialogs[0].slice(6);
      switch (window.gameLevel) {
        case 1:
          this.testing = '7000';
          break;
        case 2:
          this.testing = 'LEFT';
          break;
        case 3:
          this.testing = 'RIGHT';
          break;
        case 4:
          this.testing = '5000';
          break;
      }
    }
  },

  pointerup: function(data) {
    this.isdown = false;
  },

  pointermove: function(data) {
    if (this.isdown) this.handlepointer(data);
  },

  testPassing: function() {
    switch (this.testing) {
      case '7000':
        return 6500 <= this.altitude && this.altitude <= 7500;
      case 'LEFT':
        return this.winglevel <= -0.99;
      case 'RIGHT':
        return this.winglevel >= 0.99;
      case '5000':
        return 4500 <= this.altitude && this.altitude <= 5500;
    }
    return false;
  },

  render: function() {

    var app = this.app;
    var layer = this.app.layer;

    layer.clear("white");
    layer.drawImage(app.images.clouds, 0, 0, app.width, app.height); // TODO tessellate
    var box = getBox(app);

    var dialogHeight = box.height * 0.27;
    layer.fillStyle('#333').fillRect(box.x - 5, box.y + box.height * 0.41, box.width + 10, box.height);
    layer.fillStyle('#333').fillRect(box.x - 5, box.y - 5, box.width + 10, dialogHeight + 5);
    if (box.y == 0) {
      layer.fillStyle('#222').fillRect(0, 0, box.x, app.height);
      layer.fillStyle('#222').fillRect(box.x + box.width, 0, app.width - box.x - box.width, app.height);
    } else {
      layer.fillStyle('#222').fillRect(0, 0, app.width, box.y);
      layer.fillStyle('#222').fillRect(0, box.y + box.height, app.width, app.height - box.y - box.height);
    }

    var meterWidth = box.width * 0.425;
    var meterHeight = meterWidth * (app.images.winglevel.height / app.images.winglevel.width);
    layer.drawImage(app.images.winglevel, box.x + box.width * 0.05, box.y + box.height * 0.3 + box.height * 0.13, meterWidth, meterHeight);
    layer.drawImage(app.images.altimeter, box.x + box.width * 0.525, box.y + box.height * 0.3 + box.height * 0.13, meterWidth, meterHeight);

    var altimeter = {x: box.x + box.width * (306/414), y: box.y + box.height * (310/739) + box.height * 0.13};
    var altirads = (this.altitude / 10000) * 2 * Math.PI - 0.5 * Math.PI;
    var altiradius = box.width * (58/414);
    layer.strokeStyle('black')
      .lineWidth(box.width * 0.012)
      .beginPath()
      .moveTo(altimeter.x, altimeter.y)
      .lineTo(altimeter.x + Math.cos(altirads) * altiradius, altimeter.y + Math.sin(altirads) * altiradius)
      .stroke();

    var winglevel = {x: box.x + box.width * (110/414), y: box.y + box.height * (318/739) + box.height * 0.13};
    var wingrads = this.winglevel * 0.25 * Math.PI - 0.5 * Math.PI;
    var wingradiusX = box.width * (58/414);
    var wingradiusY = box.height * (48/739);
    layer.strokeStyle('black')
      .lineWidth(box.width * 0.012)
      .beginPath()
      .moveTo(winglevel.x, winglevel.y)
      .lineTo(winglevel.x + Math.cos(wingrads) * wingradiusX, winglevel.y + Math.sin(wingrads) * wingradiusY)
      .stroke();

    layer.fillStyle('rgb(207,226,243)')
      .fillRect(box.x + box.width * 0.235, box.y + box.height * (0.71 + 0.03) + box.height * 0.05, box.width * 0.8 * 0.66, box.width * 0.2 * 0.66)
      .fillRect(box.x + box.width * 0.435, box.y + box.height * (0.60 + 0.03) + box.height * 0.05, box.width * 0.2 * 0.66, box.width * 0.8 * 0.66);

    switch (this.position) {
      case 'center':
        layer.beginPath()
          .fillStyle('rgb(165,202,149)')
          .strokeStyle('black')
          .lineWidth(box.width * 0.005)
          .arc(box.x + box.width * 0.5, box.y + box.height * (0.748 + 0.03) + box.height * 0.05, box.width * 0.09, 0, 2 * Math.PI, false)
          .fill()
          .stroke();
        break;
      case 'up':
        layer.drawImage(app.images.stick_up, box.x + box.width * (232/520), box.y + box.height * ((504/924) + 0.03) + box.height * 0.05, box.width * (59/520), box.height * (194/924));
        break;
      case 'down':
        layer.drawImage(app.images.stick_down, box.x + box.width * (232/520), box.y + box.height * ((671/924) + 0.03) + box.height * 0.05, box.width * (59/520), box.height * (194/924));
        break;
      case 'left':
        layer.drawImage(app.images.stick_left, box.x + box.width * (82/520), box.y + box.height * ((661/924) + 0.03) + box.height * 0.05, box.height * (194/924), box.width * (59/520));
        break;
      case 'right':
        layer.drawImage(app.images.stick_right, box.x + box.width * (244/520), box.y + box.height * ((661/924) + 0.03) + box.height * 0.05, box.height * (194/924), box.width * (59/520));
        break;
    }

    var pilotImage = app.images['pilot_' + this.pilot];
    var pilotWidth = dialogHeight / pilotImage.height * pilotImage.width;
    layer.drawImage(pilotImage, box.x, box.y, pilotWidth, dialogHeight);

    if (this.dialogs.length > 0) {
      layer.textAlign('left').fillStyle('white').font(Math.floor(box.height * 0.03) + 'px sans-serif');
      wrapText(layer, this.dialogs[0], box.x + pilotWidth + box.width * 0.02, box.y + box.height * 0.05, box.width - pilotWidth - box.width * 0.02, box.height * 0.035);
    
      if (!this.testing) {
        layer.textAlign('right').fillStyle('white').font(Math.floor(box.height * 0.026) + 'px sans-serif');
        layer.fillText('Continue >', box.x + box.width * 0.98, box.y + dialogHeight * 0.98);
      }
    }

    if (this.testing) {
      layer.fillStyle(this.testPassing() ? 'rgb(30,200,30)' : 'rgb(191,191,191)')
        .beginPath()
        .arc(box.x + box.width * 0.13, box.y + box.height * 0.92, box.width * 0.05, 0, 2 * Math.PI, false)
        .fill();
    }

  }

};
