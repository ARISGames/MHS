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
    this.result = null;
    this.warning = false;
    this.warned = false;
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
    if (this.started && !this.result && !this.warning) {
      this.elapsed += dt;
      this.gametime += dt / 45;
      this.hunger += dt / 14;

      if (this.gametime >= 1) {
        this.result = 'success';
      }

      if (this.hunger >= 1) {
        this.result = 'toohungry';
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

  drawModal: function(modal, size, fn) {
    var app = this.app;
    var layer = this.app.layer;

    layer
      .fillStyle('rgba(50,50,50,0.7)')
      .fillRect(0, 0, app.width, app.height);

    var heightFrac = size === 'large' ? 0.7 : 0.2;

    var modalHeight = Math.min(app.height * heightFrac, (app.width * 0.95) / modal.width * modal.height);
    var modalWidth = modalHeight / modal.height * modal.width;

    layer.drawImage(modal,
      (app.width - modalWidth) / 2, // x
      (app.height - modalHeight) / 2, // y
      modalWidth,
      modalHeight,
    );

    return [{
      minX: 0,
      maxX: app.width,
      minY: 0,
      maxY: app.height,
      fn: fn.bind(this),
    }];
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
                this.result = 'youatefood';
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
      this.buttons = this.drawModal(app.images.modal_start, 'small', function(){
        this.started = true;
      });
    } else if (this.warning) {
      this.buttons = this.drawModal(app.images.modal_tostaybusy, 'large', function(){
        this.warning = false;
      });
    } else if (this.result === 'success') {
      this.buttons = this.drawModal(app.images.modal_success, 'large', function(){
        if (document.location.search.indexOf('6667') === -1) {
          ARIS.exitToDialog(90778);
        } else {
          ARIS.exitToDialog(98424);
        }
      });
    } else if (this.result === 'youatefood') {
      this.buttons = this.drawModal(app.images.modal_youatefood, 'large', function(){
        if (document.location.search.indexOf('6667') === -1) {
          ARIS.exitToDialog(91046);
        } else {
          ARIS.exitToDialog(98426);
        }
      });
    } else if (this.result === 'toohungry') {
      this.buttons = this.drawModal(app.images.modal_toohungry, 'large', function(){
        if (document.location.search.indexOf('6667') === -1) {
          ARIS.exitToDialog(91046);
        } else {
          ARIS.exitToDialog(98426);
        }
      });
    } else {
      this.buttons = iconButtons;
    }
  }

};
