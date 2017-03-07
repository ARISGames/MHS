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
  },

  step: function(dt) {
  },

  pointerdown: function(event) {
    var app = this.app;
    var self = this;
    this.question++;
    if (this.question > 3) this.question = 1;
  },

  textBook1: function(bookMinX, bookWidth, bookHeight) {
    var app = this.app;
    var layer = this.app.layer;

    layer.font(Math.floor(bookHeight * 0.19) + 'px sans-serif');
    layer.textAlign('center');
    layer.fillStyle('black');
    layer.fillText('北', bookMinX + bookWidth * 0.20, bookHeight * 0.35);
    layer.fillText('東', bookMinX + bookWidth * 0.20, bookHeight * 0.65);
    layer.fillText('南', bookMinX + bookWidth * 0.60, bookHeight * 0.35);
    layer.fillText('西', bookMinX + bookWidth * 0.60, bookHeight * 0.65);

    layer.font(Math.floor(bookHeight * 0.09) + 'px sans-serif');
    layer.textAlign('left');
    layer.fillStyle('black');
    layer.fillText('North', bookMinX + bookWidth * 0.29, bookHeight * 0.32);
    layer.fillText('East', bookMinX + bookWidth * 0.29, bookHeight * 0.62);
    layer.fillText('South', bookMinX + bookWidth * 0.69, bookHeight * 0.32);
    layer.fillText('West', bookMinX + bookWidth * 0.69, bookHeight * 0.62);
  },

  textBook2: function(bookMinX, bookWidth, bookHeight) {
    var app = this.app;
    var layer = this.app.layer;

    layer.font(Math.floor(bookHeight * 0.15) + 'px sans-serif');
    layer.textAlign('left');
    layer.fillStyle('black');
    layer.fillText('木曜日', bookMinX + bookWidth * 0.14, bookHeight * 0.30);
    layer.fillText('金曜日', bookMinX + bookWidth * 0.14, bookHeight * 0.48);
    layer.fillText('土曜日', bookMinX + bookWidth * 0.14, bookHeight * 0.66);

    layer.font(Math.floor(bookHeight * 0.09) + 'px sans-serif');
    layer.textAlign('left');
    layer.fillStyle('black');
    layer.fillText('Thursday', bookMinX + bookWidth * 0.55, bookHeight * 0.28);
    layer.fillText('Friday', bookMinX + bookWidth * 0.55, bookHeight * 0.46);
    layer.fillText('Saturday', bookMinX + bookWidth * 0.55, bookHeight * 0.64);
  },

  textBook3: function(bookMinX, bookWidth, bookHeight) {
    var app = this.app;
    var layer = this.app.layer;

    layer.font(Math.floor(bookHeight * 0.16) + 'px sans-serif');
    layer.textAlign('center');
    layer.fillStyle('black');
    layer.fillText('爆撃機', bookMinX + bookWidth * 0.3, bookHeight * 0.45);
    layer.fillText('戦闘機', bookMinX + bookWidth * 0.7, bookHeight * 0.45);

    layer.font(Math.floor(bookHeight * 0.07) + 'px sans-serif');
    layer.textAlign('center');
    layer.fillStyle('black');
    layer.fillText('bombers', bookMinX + bookWidth * 0.3, bookHeight * 0.55);
    layer.fillText('fighter planes', bookMinX + bookWidth * 0.7, bookHeight * 0.55);
  },

  render: function() {
    var app = this.app;
    var layer = this.app.layer;
    var scaling = app.height / 600;

    layer.clear("white");

    var book = app.images.book;
    var bookHeight = app.height * 0.45;
    var bookWidth = Math.min(app.width, book.width * (bookHeight / book.height));
    bookHeight = book.height * (bookWidth / book.width);
    var bookMinX = (app.width - bookWidth) / 2;
    var paperMinY = bookHeight / 2;
    var paperMaxY = app.height * 0.8;
    layer.drawImage(app.images.paper, 0, paperMinY, app.width, paperMaxY - paperMinY);
    layer.drawImage(app.images.book, bookMinX, 0, bookWidth, bookHeight);

    switch (this.question) {
      case 1: this.textBook1(bookMinX, bookWidth, bookHeight); break;
      case 2: this.textBook2(bookMinX, bookWidth, bookHeight); break;
      case 3: this.textBook3(bookMinX, bookWidth, bookHeight); break;
    }

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
  }

};
