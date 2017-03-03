function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

var food = ['apple', 'burger', 'donut', 'popcorn', 'sandwich'];
var distractions = ['book', 'cinema', 'guitar', 'record'];

ENGINE.Game = {

  create: function() {
    this.started = false;
    this.finished = false;
    this.won = false;
    this.lost = false;
    this.elapsed = 0;
    this.gametime = 0;
    this.hunger = 0;
    this.buttons = [];
    this.shops = [
      'art',
      'bakery',
      'barber',
      'bookstore',
      'boutique',
      'coffee',
      'fastfood',
      'flowers',
      'fruits',
      'icecream',
      'market',
      'music',
      'pets',
      'pizza',
      'vegetables',
      'watch',
    ];
    shuffle(this.shops);
    this.shops.push(this.shops[0]);
    this.shops.push(this.shops[1]);
    this.shops.push(this.shops[2]);
    this.icons = [];
    for (var i = 0; i < 80; i++) {
      this.icons.push(food[Math.floor(Math.random() * food.length)]);
      this.icons.push(distractions[Math.floor(Math.random() * distractions.length)]);
    }
  },

  step: function(dt) {
    if (this.started && !this.finished) {
      this.elapsed += dt;
      this.gametime += dt / 60;
      this.hunger += dt / 20;

      if (this.gametime >= 1) {
        this.gametime = 1;
        this.finished = true;
        this.won = true;
      }

      if (this.hunger >= 1) {
        this.hunger = 1;
        this.finished = true;
        this.lost = true;
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

    var shopX = backgroundOffset + 20 * scaling;
    this.shops.forEach(function(shop){
      if (shopX > app.width) return;
      var img = app.images['shop_' + shop];
      var shopWidth = img.width * scaling * 0.7;
      var shopHeight = img.height * scaling * 0.7;
      layer.drawImage(img, shopX, app.height * 0.85 - shopHeight, shopWidth, shopHeight);
      shopX += shopWidth + 10 * scaling;
    });

    var iconButtons = [];
    var iconX = backgroundOffset * 2 + 20 * scaling;
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
              this.hunger -= 0.1;
            } else {
              this.hunger -= 0.2;
            }
            if (this.hunger < 0) this.hunger = 0;
          },
        });
      }
      iconX += iconWidth + 40 * scaling;
    });

    var walkImage = app.images['Walking_man_' + (Math.floor(this.elapsed * 3) % 4 + 1)];
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
      this.buttons = [{
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
        fn: function(){ this.started = true; },
      }];
    } else {
      this.buttons = iconButtons;
    }
  }

};
