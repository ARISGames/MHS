// Generated by CoffeeScript 1.9.3
(function() {
  var Spinner, allReady, countdown, f, i, inRect, len, oneReady, waitFor;

  inRect = function(rect, x, y) {
    return ((rect.x <= x && x <= rect.x + rect.w)) && ((rect.y <= y && y <= rect.y + rect.h));
  };

  Spinner = {
    create: function() {
      return this.positions = [-892, -698, -287];
    },
    step: function() {},
    render: function() {
      this.app.layer.drawImage(this.app.images.bg, 0, 0);
      this.app.layer.drawImage(this.app.images.row0, this.positions[0], 647);
      this.app.layer.drawImage(this.app.images.row1, this.positions[1], 767);
      return this.app.layer.drawImage(this.app.images.row2, this.positions[2], 887);
    },
    onScreen: function(x, y) {
      return (x != null) && (y != null) && ((0 <= x && x < 640)) && ((0 <= y && y < 1008));
    },
    pointerdown: function(arg) {
      var row, x, y;
      x = arg.x, y = arg.y;
      if (!this.onScreen(x, y)) {
        return;
      }
      if ((647 <= y && y < 647 + 108)) {
        row = 0;
      } else if ((767 <= y && y < 767 + 108)) {
        row = 1;
      } else if ((887 <= y && y < 887 + 108)) {
        row = 2;
      } else {
        return;
      }
      return this.clicked = {
        row: row,
        position: this.positions[row],
        x: x
      };
    },
    pointerup: function(arg) {
      var x, y;
      x = arg.x, y = arg.y;
      return this.clicked = null;
    },
    pointermove: function(arg) {
      var x, y;
      x = arg.x, y = arg.y;
      if (!this.onScreen(x, y)) {
        return;
      }
      if (this.clicked == null) {
        return;
      }
      return this.positions[this.clicked.row] = this.clicked.position + (x - this.clicked.x);
    }
  };

  allReady = function() {
    return window.game = playground({
      create: function() {
        this.loadImage('bg.jpg');
        this.loadImage('row0');
        this.loadImage('row1');
        return this.loadImage('row2');
      },
      ready: function() {
        return this.setState(Spinner);
      },
      container: document.getElementById('the-box')
    });
  };

  countdown = -1;

  oneReady = function() {
    countdown--;
    if (countdown === 0) {
      return allReady();
    }
  };

  waitFor = [
    (function() {
      return window.ARIS = {
        ready: oneReady
      };
    }), (function() {
      return document.addEventListener('DOMContentLoaded', oneReady);
    })
  ];

  countdown = waitFor.length;

  for (i = 0, len = waitFor.length; i < len; i++) {
    f = waitFor[i];
    f();
  }

  ARIS.exitToDialog = function(d) {
    return console.log("exiting to dialog " + d);
  };

  ARIS.givePlayerItemCount = function(item_id, count) {
    return console.log("giving player " + count + " of item " + item_id);
  };

  ARIS.ready();

}).call(this);
