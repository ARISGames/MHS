function exitToDialog(id) {
  try {
    ARIS.exitToDialog(id);
  } catch (e) {
    console.log('In ARIS, this would go to dialog ' + id);
  }
}

ENGINE.Game = {

  create: function() {
  },

  step: function(dt) {
  },

  pointerdown: function(event) {
    var app = this.app;
    var self = this;
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
    var paperMinY = bookHeight / 2;
    var paperMaxY = app.height * 0.8;
    layer.drawImage(
      app.images.paper,
      0,
      paperMinY,
      app.width,
      paperMaxY - paperMinY
    );
    layer.drawImage(app.images.book, (app.width - bookWidth) / 2, 0, bookWidth, bookHeight);
  }

};
