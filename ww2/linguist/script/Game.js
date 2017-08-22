function exitToDialog(id) {
  try {
    ARIS.exitToDialog(id);
  } catch (e) {
    console.log('In ARIS, this would go to dialog ' + id);
  }
}

ENGINE.Game = {

  create: function() {
    this.question = 1;
    this.right = 0;
    this.wrong = 0;
    this.popup = null;
    this.buttons = [];
  },

  step: function(dt) {
  },

  pointerdown: function(event) {
    var app = this.app;
    var self = this;
    self.buttons.forEach(function(button){
      if (!button.maxX) button.maxX = button.minX + button.width;
      if (!button.maxY) button.maxY = button.minY + button.height;
      if (button.minX <= event.x && event.x <= button.maxX && button.minY <= event.y && event.y <= button.maxY) {
        button.fn.bind(self)();
      }
    });
  },

  textBook1: function(bookMinX, bookMinY, bookWidth, bookHeight) {
    var app = this.app;
    var layer = this.app.layer;
    return [
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookMinY + bookHeight * 0.20,
        width: bookWidth * 0.36,
        height: bookHeight * 0.25,
        fn: function(){ this.popup = 'wrong1'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookMinY + bookHeight * 0.20,
        width: bookWidth * 0.36,
        height: bookHeight * 0.25,
        fn: function(){ this.popup = 'wrong1'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookMinY + bookHeight * 0.53,
        width: bookWidth * 0.36,
        height: bookHeight * 0.25,
        fn: function(){ this.popup = 'right1'; this.right++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookMinY + bookHeight * 0.53,
        width: bookWidth * 0.36,
        height: bookHeight * 0.25,
        fn: function(){ this.popup = 'wrong1'; this.wrong++; }
      },
    ];
  },

  textBook2: function(bookMinX, bookMinY, bookWidth, bookHeight) {
    var app = this.app;
    var layer = this.app.layer;
    return [
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookMinY + bookHeight * 0.15,
        width: bookWidth * 0.36,
        height: bookHeight * 0.19,
        fn: function(){ this.popup = 'wrong2'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookMinY + bookHeight * 0.19,
        width: bookWidth * 0.36,
        height: bookHeight * 0.18,
        fn: function(){ this.popup = 'wrong2'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookMinY + bookHeight * 0.38,
        width: bookWidth * 0.36,
        height: bookHeight * 0.19,
        fn: function(){ this.popup = 'wrong2'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookMinY + bookHeight * 0.42,
        width: bookWidth * 0.36,
        height: bookHeight * 0.18,
        fn: function(){ this.popup = 'wrong2'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookMinY + bookHeight * 0.62,
        width: bookWidth * 0.36,
        height: bookHeight * 0.19,
        fn: function(){ this.popup = 'right2'; this.right++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookMinY + bookHeight * 0.66,
        width: bookWidth * 0.36,
        height: bookHeight * 0.18,
        fn: function(){ this.popup = 'right2'; this.right++; }
      },
    ]
  },

  textBook3: function(bookMinX, bookMinY, bookWidth, bookHeight) {
    var app = this.app;
    var layer = this.app.layer;
    return [
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookMinY + bookHeight * 0.30,
        width: bookWidth * 0.35,
        height: bookHeight * 0.35,
        fn: function(){ this.popup = 'wrong3'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.53,
        minY: bookMinY + bookHeight * 0.30,
        width: bookWidth * 0.35,
        height: bookHeight * 0.41,
        fn: function(){ this.popup = 'right3'; this.right++; }
      },
    ];
  },

  drawPopup: function() {
    var app = this.app;
    var layer = this.app.layer;

    var popImage = app.images[this.popup];
    var popWidth = Math.min(app.width, popImage.width * (app.height / popImage.height));
    var popHeight = popImage.height * (popWidth / popImage.width);
    var popMinX = (app.width - popWidth) / 2;
    var popMinY = (app.height - popHeight) / 2;
    var popMaxX = popMinX + popWidth;
    var popMaxY = popMinY + popHeight;

    layer.drawImage(popImage, popMinX, popMinY, popWidth, popHeight);
    layer.fillStyle('rgba(0,0,0,0.88)')
      .fillRect(0, 0, app.width, popMinY + 0.5)
      .fillRect(0, popMaxY - 0.5, app.width, app.height - popMaxY + 0.5)
      .fillRect(0, popMinY, popMinX + 0.5, popHeight)
      .fillRect(popMaxX - 0.5, popMinY, popMinX + 0.5, popHeight);
    return [
      { minX: 0,
        minY: 0,
        maxX: app.width,
        maxY: app.height,
        fn: function(){
          if (this.question === 3) {
            if (this.wrong <= 1) {
              if (document.location.search.indexOf('6667') === -1) {
                ARIS.exitToDialog(90815);
              } else {
                ARIS.exitToDialog(98419);
              }
            } else {
              if (document.location.search.indexOf('6667') === -1) {
                ARIS.exitToDialog(91061);
              } else {
                ARIS.exitToDialog(98528);
              }
            }
          } else {
            this.question++;
            this.popup = null;
          }
        }
      }
    ];
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;
    var scaling = app.height / 600;

    layer.clear("white");

    // first split the screen into parts
    var jpnHeightFull = app.height * 0.43;
    var jpnMinY = 0;
    var jpnMaxY = jpnMinY + jpnHeightFull;

    var bookHeightFull = app.height * 0.43;
    var bookMinY = jpnMaxY;
    var bookMaxY = bookMinY + bookHeightFull;

    var engHeightFull = app.height - jpnHeightFull - bookHeightFull;
    var engMinY = bookMaxY;
    var engMaxY = engMinY + engHeightFull;

    // now calculate widths and fix heights
    var jpnImage = app.images['japanese' + this.question];
    var jpnWidth = Math.min(app.width, jpnImage.width * (jpnHeightFull / jpnImage.height));
    var jpnHeight = jpnImage.height * (jpnWidth / jpnImage.width);
    jpnMinY += (jpnHeightFull - jpnHeight) / 2;
    jpnMinX = (app.width - jpnWidth) / 2;

    var bookImage = app.images['book' + this.question];
    var bookWidth = Math.min(app.width, bookImage.width * (bookHeightFull / bookImage.height));
    var bookHeight = bookImage.height * (bookWidth / bookImage.width);
    bookMinY += (bookHeightFull - bookHeight) / 2;
    bookMinX = (app.width - bookWidth) / 2;

    var engImage = app.images['english' + this.question];
    var engWidth = Math.min(app.width, engImage.width * (engHeightFull / engImage.height));
    var engHeight = engImage.height * (engWidth / engImage.width);
    engMinY += (engHeightFull - engHeight) / 2;
    engMinX = (app.width - engWidth) / 2;

    // finally draw the images
    layer.fillStyle('rgb(193,203,191)');
    layer.fillRect(0, 0, app.width, engMinY);
    layer.drawImage(jpnImage, jpnMinX, jpnMinY, jpnWidth, jpnHeight);
    layer.drawImage(bookImage, bookMinX, bookMinY, bookWidth, bookHeight);
    layer.drawImage(engImage, engMinX, engMinY, engWidth, engHeight);

    var bookButtons;
    switch (this.question) {
      case 1: bookButtons = this.textBook1(bookMinX, bookMinY, bookWidth, bookHeight); break;
      case 2: bookButtons = this.textBook2(bookMinX, bookMinY, bookWidth, bookHeight); break;
      case 3: bookButtons = this.textBook3(bookMinX, bookMinY, bookWidth, bookHeight); break;
    }
    /* for testing
    bookButtons.forEach(function(button){
      layer.fillStyle('rgba(255,0,0,0.5)').fillRect(button.minX, button.minY, button.width, button.height);
    });
    */

    switch (this.popup) {
      case 'right1':
        this.buttons = this.drawPopup();
        break;
      case 'wrong1':
        this.buttons = this.drawPopup();
        break;
      case 'right2':
        this.buttons = this.drawPopup();
        break;
      case 'wrong2':
        this.buttons = this.drawPopup();
        break;
      case 'right3':
        this.buttons = this.drawPopup();
        break;
      case 'wrong3':
        this.buttons = this.drawPopup();
        break;
      default:
        this.buttons = bookButtons;
        break;
    }
  }

};
