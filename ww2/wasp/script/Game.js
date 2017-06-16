ENGINE.Game = {

  create: function() {
    this.increaseLevel();

    this.position = 'center';
    this.elapsed = 0;
    this.winglevel = 0;
    this.altitude = 1500;

    this.cloudX = 0;

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
    if (this.altitude > 9000) this.altitude = 9000;

    if (this.position == 'right') {
      this.winglevel -= dt * 0.7;
    } else if (this.position == 'left') {
      this.winglevel += dt * 0.7;
    } else {
      if      (this.winglevel > 0) this.winglevel -= Math.min( this.winglevel, dt * 0.4);
      else if (this.winglevel < 0) this.winglevel += Math.min(-this.winglevel, dt * 0.4);
    }

    if (this.winglevel < -1) this.winglevel = -1;
    if (this.winglevel > 1) this.winglevel = 1;

    this.cloudX -= this.winglevel * dt;

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

    if (0.42 <= x && x <= 0.42 + 0.16 && 0.67 <= y && y <= 0.67 + 0.12) {
      this.position = 'up';
      return;
    } else if (0.42 <= x && x <= 0.42 + 0.16 && 0.865 <= y && y <= 0.865 + 0.12) {
      this.position = 'down';
      return;
    } else if (0.24 <= x && x <= 0.24 + 0.2 && 0.78 <= y && y <= 0.78 + 0.09) {
      this.position = 'left';
      return;
    } else if (0.56 <= x && x <= 0.56 + 0.2 && 0.78 <= y && y <= 0.78 + 0.09) {
      this.position = 'right';
      return;
    } else if (0.42 <= x && x <= 0.42 + 0.16 && 0.78 <= y && y <= 0.78 + 0.09) {
      this.position = 'center';
      return;
    }
  },

  pointerdown: function(data) {
    this.isdown = true;

    var box = getBox(this.app);
    var x = (data.x - box.x) / box.width;
    var y = (data.y - box.y) / box.height;

    if (0.7 <= x && x <= 1 && 0.9 <= y && y <= 1 && !(this.testing)) {
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
      this.position = 'center';
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
    var box = getBox(app);

    var modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

    var cockpitWidth = box.width;
    var cockpitHeight = cockpitWidth / app.images.cockpit.width * app.images.cockpit.height;

    var cloudWidth = box.width * 7;
    var cloudHeight = cloudWidth / app.images.sky.width * app.images.sky.height;
    var cloudOffsetX = modulo(this.cloudX * 500, cloudWidth);
    var cloudOffsetY = -1 * (cloudHeight - cockpitHeight) * (1 - this.altitude / 9000)
    layer.drawImage(app.images.sky, box.x + cloudOffsetX, box.y + cloudOffsetY, cloudWidth, cloudHeight);
    layer.drawImage(app.images.sky, box.x + (cloudOffsetX - cloudWidth), box.y + cloudOffsetY, cloudWidth, cloudHeight);

    layer.drawImage(app.images.cockpit, box.x, box.y, cockpitWidth, cockpitHeight);
    layer.fillStyle('white')
      .fillRect(box.x, cockpitHeight, box.width, box.height - cockpitHeight);

    if (box.y == 0) {
      layer.fillStyle('#222').fillRect(0, 0, box.x, app.height);
      layer.fillStyle('#222').fillRect(box.x + box.width, 0, app.width - box.x - box.width, app.height);
    } else {
      layer.fillStyle('#222').fillRect(0, 0, app.width, box.y);
      layer.fillStyle('#222').fillRect(0, box.y + box.height, app.width, app.height - box.y - box.height);
    }

    var leftGaugeX = box.x + box.width * 0.05;
    var rightGaugeX = box.x + box.width * 0.525;
    var gaugeY = box.y + box.height * 0.325;
    var meterWidth = box.width * 0.425;
    var meterHeight = meterWidth * (app.images.gauge_left.height / app.images.gauge_left.width);
    layer.drawImage(app.images.gauge_left, leftGaugeX, gaugeY, meterWidth, meterHeight);
    layer.drawImage(app.images.gauge_right, rightGaugeX, gaugeY, meterWidth, meterHeight);

    var wingrads = this.winglevel * 2/9 * Math.PI;
    layer.save();
    layer.translate(leftGaugeX + meterWidth/2, gaugeY + meterHeight/2);
    layer.rotate(wingrads);
    layer.drawImage(app.images.gauge_left_spinner, -meterWidth/2, -meterHeight/2, meterWidth, meterHeight);
    layer.restore();

    var altirads = (-0.97 + ((this.altitude / 9000) * 1.76)) * Math.PI;
    layer.save();
    layer.translate(rightGaugeX + meterWidth/2, gaugeY + meterHeight/2);
    layer.rotate(altirads);
    layer.drawImage(app.images.gauge_right_spinner, -meterWidth/2, -meterHeight/2, meterWidth, meterHeight);
    layer.restore();

    layer.drawImage(app.images['stick_' + this.position], box.x + box.width * 0.15, box.y + box.height * 0.63, box.width * 0.7, box.width * 0.7);
    if (!this.testing) {
      layer.textAlign('right').fillStyle('black').font(Math.floor(box.height * 0.032) + 'px sans-serif')
        .fillText('Continue >', box.x + box.width * 0.98, box.y + box.height * 0.97);
    }

    if (this.dialogs.length > 0) {
      layer.textAlign('center').fillStyle('black').font(Math.floor(box.height * 0.025) + 'px sans-serif');
      wrapText(
        layer,
        this.dialogs[0],
        box.x + box.width * 0.5,
        box.y + cockpitHeight + box.height * 0.04,
        box.width * 0.94,
        box.height * 0.033
      );
    }

    if (this.testing) {
      if (this.testing.match(/^\d+$/)) {
        layer.drawImage(this.testPassing() ? app.images.light_green : app.images.light_red
          , rightGaugeX + meterWidth * 0.4
          , gaugeY + app.height * 0.015
          , meterWidth * 0.2
          , meterHeight * 0.2
          );
      } else {
        layer.drawImage(this.testPassing() ? app.images.light_green : app.images.light_red
          , leftGaugeX + meterWidth * 0.4
          , gaugeY + app.height * 0.015
          , meterWidth * 0.2
          , meterHeight * 0.2
          );
      }
    }

  }

};
