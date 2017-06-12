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

  textBook1: function(bookMinX, bookWidth, bookHeight) {
    var app = this.app;
    var layer = this.app.layer;
    return [
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookHeight * 0.20,
        width: bookWidth * 0.36,
        height: bookHeight * 0.22,
        fn: function(){ this.popup = 'wrong1'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookHeight * 0.20,
        width: bookWidth * 0.36,
        height: bookHeight * 0.22,
        fn: function(){ this.popup = 'wrong1'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookHeight * 0.55,
        width: bookWidth * 0.36,
        height: bookHeight * 0.22,
        fn: function(){ this.popup = 'right1'; this.right++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookHeight * 0.55,
        width: bookWidth * 0.36,
        height: bookHeight * 0.22,
        fn: function(){ this.popup = 'wrong1'; this.wrong++; }
      },
    ];
  },

  textBook2: function(bookMinX, bookWidth, bookHeight) {
    var app = this.app;
    var layer = this.app.layer;
    return [
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookHeight * 0.14,
        width: bookWidth * 0.36,
        height: bookHeight * 0.18,
        fn: function(){ this.popup = 'wrong2'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookHeight * 0.18,
        width: bookWidth * 0.36,
        height: bookHeight * 0.18,
        fn: function(){ this.popup = 'wrong2'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookHeight * 0.38,
        width: bookWidth * 0.36,
        height: bookHeight * 0.18,
        fn: function(){ this.popup = 'wrong2'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookHeight * 0.42,
        width: bookWidth * 0.36,
        height: bookHeight * 0.18,
        fn: function(){ this.popup = 'wrong2'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.12,
        minY: bookHeight * 0.63,
        width: bookWidth * 0.36,
        height: bookHeight * 0.18,
        fn: function(){ this.popup = 'right2'; this.right++; }
      },
      { minX: bookMinX + bookWidth * 0.52,
        minY: bookHeight * 0.67,
        width: bookWidth * 0.36,
        height: bookHeight * 0.18,
        fn: function(){ this.popup = 'right2'; this.right++; }
      },
    ]
  },

  textBook3: function(bookMinX, bookWidth, bookHeight) {
    var app = this.app;
    var layer = this.app.layer;
    return [
      { minX: bookMinX + bookWidth * 0.10,
        minY: bookHeight * 0.30,
        width: bookWidth * 0.36,
        height: bookHeight * 0.35,
        fn: function(){ this.popup = 'wrong3'; this.wrong++; }
      },
      { minX: bookMinX + bookWidth * 0.54,
        minY: bookHeight * 0.30,
        width: bookWidth * 0.36,
        height: bookHeight * 0.4,
        fn: function(){ this.popup = 'right3'; this.right++; }
      },
    ];
  },

  drawPopup: function() {
    var app = this.app;
    var layer = this.app.layer;
    layer.fillStyle('rgba(255,255,255,0.6)');
    layer.fillRect(0, 0, app.width, app.height);
    var popupHeight = app.height * 0.6;
    layer.fillStyle('black');
    layer.fillRect(0, (app.height - popupHeight) / 2, app.width, popupHeight);
    layer.fillStyle('#ccc');
    layer.fillRect(0, (app.height - popupHeight) / 2 + popupHeight * 0.02, app.width, popupHeight - popupHeight * 0.04);
    var correct = this.popup[0] === 'r';
    layer.fillStyle(correct ? 'green' : 'red');
    layer.textAlign('center');
    layer.font(Math.floor(app.height * 0.08) + 'px sans-serif');
    layer.fillText((correct ? 'Correct!' : 'Incorrect'), app.width / 2, app.height * 0.35);
    layer.fillStyle('black');
    layer.font(Math.floor(app.height * 0.038) + 'px sans-serif');
    var line1, line2, line3, line4;
    switch (this.popup) {
      case 'right1':
        line1 = 'The US Navy sunk the';
        line2 = 'ship before it attacked.';
        line3 = '100 lives saved!';
        line4 = '';
        break;
      case 'right2':
        line1 = 'The Allies captured the';
        line2 = 'general and stopped his';
        line3 = 'next attack!';
        line4 = '200 lives saved!';
        break;
      case 'right3':
        line1 = 'The US shot down';
        line2 = 'all 150 planes.';
        line3 = '500 lives saved!';
        line4 = '';
        break;
      case 'wrong1':
        line1 = 'The Japanese ship';
        line2 = 'attacked the US ship. 100';
        line3 = 'US Navy men injured. Look';
        line4 = 'closely next time!';
        break;
      case 'wrong2':
        line1 = 'The general attacked.';
        line2 = '4 islands lost to the';
        line3 = 'Japanese. Be more';
        line4 = 'careful next time!';
        break;
      case 'wrong3':
        line1 = '';
        line2 = 'The 150 fighter planes';
        line3 = 'attacked. 3 ships lost.';
        line4 = '';
        break;
    }
    layer.fillText(line1, app.width / 2, app.height * 0.46);
    layer.fillText(line2, app.width / 2, app.height * 0.55);
    layer.fillText(line3, app.width / 2, app.height * 0.64);
    layer.fillText(line4, app.width / 2, app.height * 0.73);
    layer.font(Math.floor(app.height * 0.05) + 'px sans-serif');
    layer.fillStyle('white');
    layer.fillText('TAP TO CONTINUE', app.width / 2 - 4, app.height * 0.9 - 4);
    layer.fillText('TAP TO CONTINUE', app.width / 2 - 4, app.height * 0.9 + 4);
    layer.fillText('TAP TO CONTINUE', app.width / 2 + 4, app.height * 0.9 - 4);
    layer.fillText('TAP TO CONTINUE', app.width / 2 + 4, app.height * 0.9 + 4);
    layer.fillStyle('black');
    layer.fillText('TAP TO CONTINUE', app.width / 2, app.height * 0.9);
    return [
      { minX: 0,
        minY: 0,
        maxX: app.width,
        maxY: app.height,
        fn: function(){
          if (this.question === 3) {
            if (this.wrong <= 1) {
              exitToDialog(90815);
            } else {
              exitToDialog(91061);
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

    var book = app.images['book' + this.question];
    var bookHeight = app.height * 0.45;
    var bookWidth = Math.min(app.width, book.width * (bookHeight / book.height));
    bookHeight = book.height * (bookWidth / book.width);
    var bookMinX = (app.width - bookWidth) / 2;
    var paperMinY = bookHeight / 2;
    var paperMaxY = app.height * 0.8;
    layer.drawImage(book, bookMinX, 0, bookWidth, bookHeight);

    var bookButtons;
    switch (this.question) {
      case 1: bookButtons = this.textBook1(bookMinX, bookWidth, bookHeight); break;
      case 2: bookButtons = this.textBook2(bookMinX, bookWidth, bookHeight); break;
      case 3: bookButtons = this.textBook3(bookMinX, bookWidth, bookHeight); break;
    }
    /* for testing
    bookButtons.forEach(function(button){
      layer.fillStyle('rgba(255,0,0,0.5)').fillRect(button.minX, button.minY, button.width, button.height);
    });
    */

    var jpnImage = app.images['japanese' + this.question];
    var jpnHeight = paperMaxY - bookHeight;
    var jpnWidth = Math.min(app.width, jpnImage.width * (jpnHeight / jpnImage.height));
    jpnHeight = jpnImage.height * (jpnWidth / jpnImage.width);
    layer.drawImage(jpnImage, (app.width - jpnWidth) / 2, bookHeight, jpnWidth, jpnHeight);

    var engImage = app.images['english' + this.question];
    var engHeight = app.height - paperMaxY;
    var engWidth = Math.min(app.width, engImage.width * (engHeight / engImage.height));
    engHeight = engImage.height * (engWidth / engImage.width);
    layer.drawImage(engImage, (app.width - engWidth) / 2, paperMaxY, engWidth, engHeight);

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
