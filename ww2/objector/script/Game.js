function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

var food = ['apple', 'burger', 'candy', 'chocolate', 'donut', 'popcorn', 'sandwich', 'shake'];
var distractions = ['book', 'cinema', 'guitar', 'record'];

ENGINE.Game = {

  create: function() {
    this.started = false;
    this.finished = false;
    this.warning = false;
    this.warned = false;
    this.won = false;
    this.lost = false;
    this.elapsed = 0;
    this.gametime = 0;
    this.hunger = 0;
    this.buttons = [];
    this.icons = [];
    var foodChain = 0;
    var distractionChain = 0;
    for (var i = 0; i < 140; i++) {
      if ((Math.random() < (80 / (i + 150)) && distractionChain < 3) || foodChain > 5) {
        this.icons.push(distractions[Math.floor(Math.random() * distractions.length)]);
        foodChain = 0;
        distractionChain++;
      } else {
        this.icons.push(food[Math.floor(Math.random() * food.length)]);
        foodChain++;
        distractionChain = 0;
      }
    }
  },

  step: function(dt) {
    if (this.started && !this.finished && !this.warning) {
      this.elapsed += dt;
      this.gametime += dt / 45;
      this.hunger += dt / 14;

      if (this.gametime >= 1) {
        this.app.setState(ENGINE.Won);
      }

      if (this.hunger >= 1) {
        this.app.setState(ENGINE.Hunger);
        if (document.location.search.indexOf('6667') === -1) {
          ARIS.exitToDialog(91046);
        } else {
          ARIS.exitToDialog(98426);
        }
      }
    }
  },

  pointerdown: function(event) {
    var app = this.app;
    var self = this;
    this.buttons.forEach(function(button){
      if (button.minX <= event.x && event.x <= button.maxX && button.minY <= event.y && event.y <= button.maxY) {
        button.fn.bind(self)();
      }
    });
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;
    var scaling = app.height / 600;

    layer.clear("#222");

    var backgroundWidth = app.images.background.width * (app.height / app.images.background.height);
    var backgroundOffset = -1 * this.gametime * (backgroundWidth - app.width);
    layer.drawImage(app.images.background, backgroundOffset, 0, backgroundWidth, app.height);

    var iconButtons = [];
    var iconX = backgroundOffset * 2.3 + 20 * scaling;
    this.icons.forEach(function(icon, i){
      if (iconX > app.width) return;
      var iconWidth = app.height * 0.15;
      if (icon !== null) {
        var img = app.images['icon_' + icon];
        var iconHeight = img.height * (iconWidth / img.width);
        var iconY = app.height * 0.25 - iconHeight / 2;
        layer.drawImage(img, iconX, iconY, iconWidth, iconHeight);
        iconButtons.push({
          minX: iconX,
          maxX: iconX + iconWidth,
          minY: iconY,
          maxY: iconY + iconHeight,
          fn: function(){
            this.icons[i] = null;
            if (distractions.indexOf(icon) !== -1) {
              this.hunger -= 0.08;
            } else {
              this.hunger -= 0.16;
              if (this.warned) {
                app.setState(ENGINE.AteFood);
                if (document.location.search.indexOf('6667') === -1) {
                  ARIS.exitToDialog(91046);
                } else {
                  ARIS.exitToDialog(98426);
                }
              } else {
                this.warning = true;
                this.warned = true;
              }
            }
            if (this.hunger < 0) this.hunger = 0;
          },
        });
      }
      iconX += iconWidth + 40 * scaling;
    });

    var walkImage = app.images['walking-v2-' + (Math.floor(this.elapsed * 18) % 24)];
    var walkHeight = app.height * 0.4;
    var walkWidth = walkImage.width * (walkHeight / walkImage.height);
    layer.drawImage(walkImage, this.gametime * (app.width - walkWidth), app.height - walkHeight, walkWidth, walkHeight);

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
      layer
        .fillStyle('rgba(255,255,255,0.5)')
        .fillRect(0, 0, app.width, app.height);

      var minX = app.width / 2 - 100 * scaling;
      var maxX = app.width / 2 + 100 * scaling;
      var minY = app.height / 2 - 50 * scaling;
      var maxY = app.height / 2 + 50 * scaling;
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
        .fillText('START', app.width / 2, maxY - 35 * scaling);
      this.buttons = [{
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        fn: function(){ this.started = true; },
      }];
    } else if (this.warning) {
      layer
        .fillStyle('rgba(255,255,255,0.8)')
        .fillRect(0, 0, app.width, app.height);

      var textMinY = app.height * (1/5);

      layer.font((22 * scaling) + 'px sans-serif');
      layer.textAlign('center');
      layer
        .fillStyle('black')
        .fillText("To stay in the study,", app.width / 2, textMinY)
        .fillText("don't eat any extra food.", app.width / 2, textMinY + 50 * scaling)
        .fillText("Stay busy by tapping", app.width / 2, textMinY + 100 * scaling)
        .fillText("items that aren't food.", app.width / 2, textMinY + 150 * scaling);

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
      this.buttons = [{
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        fn: function(){ this.warning = false; },
      }];
    } else {
      this.buttons = iconButtons;
    }
  }

};
