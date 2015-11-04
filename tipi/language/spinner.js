// Generated by CoffeeScript 1.9.3
(function() {
  var Spinner, allReady, inRect, languageGameFailure, languageGameSuccess, oneReady, readies,
    modulo = function(a, b) { return (+a % (b = +b) + b) % b; };

  languageGameSuccess = 29453;

  languageGameFailure = 30405;

  inRect = function(rect, x, y) {
    return ((rect.x <= x && x <= rect.x + rect.w)) && ((rect.y <= y && y <= rect.y + rect.h));
  };

  Spinner = {
    create: function() {
      this.columns = [0, 0, 0];
      this.pointerInfo = null;
      return this.words = [['Orange', 'Good', 'Hazy'], ['Day', 'Year', 'Night'], ['Mother', 'Friend', 'Relative']];
    },
    step: function() {},
    getDims: function() {
      var colWidth;
      colWidth = (this.app.layer.width - 10) / 3;
      return {
        column0: {
          x: 5,
          y: 5,
          w: colWidth,
          h: this.app.layer.height - 10
        },
        column1: {
          x: 5 + colWidth,
          y: 5,
          w: colWidth,
          h: this.app.layer.height - 10
        },
        column2: {
          x: 5 + colWidth + colWidth,
          y: 5,
          w: colWidth,
          h: this.app.layer.height - 10
        },
        row: {
          w: this.app.layer.width - 10,
          h: (this.app.layer.height - 10) / 3
        }
      };
    },
    render: function() {
      var c, col, dims, fillColors, i, j, k, l, len, len1, len2, len3, len4, len5, m, n, o, r, ref, ref1, ref2, ref3, ref4, ref5, repeat, rowOffset, y;
      dims = this.getDims();
      this.app.layer.clear('black');
      this.app.layer.globalAlpha(1);
      this.app.layer.strokeStyle('black');
      this.app.layer.lineWidth(7);
      fillColors = ['#48b', '#8b4', '#b58'];
      ref = [dims.column0, dims.column1, dims.column2];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        col = ref[i];
        this.app.layer.fillStyle(fillColors[i]);
        this.app.layer.fillRect(col.x, col.y, col.w, col.h);
        this.app.layer.strokeRect(col.x, col.y, col.w, col.h);
      }
      this.app.layer.lineWidth(1);
      ref1 = [0, 1, 2];
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        r = ref1[k];
        col = dims["column" + r];
        rowOffset = this.columns[r] % 1;
        ref2 = [0, 1, 2];
        for (l = 0, len2 = ref2.length; l < len2; l++) {
          i = ref2[l];
          y = col.y + (i + rowOffset) * dims.row.h;
          this.app.layer.strokeLine(col.x, y, col.x + col.w, y);
        }
      }
      this.app.layer.textAlign('center');
      this.app.layer.textBaseline('middle');
      this.app.layer.fillStyle('black');
      this.app.layer.font((this.app.layer.height / 10) + "px sans-serif");
      ref3 = [0, 1, 2];
      for (m = 0, len3 = ref3.length; m < len3; m++) {
        c = ref3[m];
        col = dims["column" + c];
        ref4 = [0, 1, 2];
        for (n = 0, len4 = ref4.length; n < len4; n++) {
          r = ref4[n];
          y = col.y + col.h / 2 + (this.columns[c] + r) * dims.row.h;
          ref5 = [-2, -1, 0];
          for (o = 0, len5 = ref5.length; o < len5; o++) {
            repeat = ref5[o];
            this.app.layer.fillText(this.words[c][r], col.x + col.w / 2, y + dims.column1.h * repeat);
          }
        }
      }
      this.app.layer.fillStyle('black');
      this.app.layer.globalAlpha(0.3);
      this.app.layer.fillRect(dims.column0.x, dims.column0.y, dims.row.w, dims.row.h);
      return this.app.layer.fillRect(dims.column0.x, dims.column0.y + 2 * dims.row.h, dims.row.w, dims.row.h);
    },
    getWords: function() {
      var c, j, len, ref, results;
      ref = [0, 1, 2];
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        results.push(this.words[c][modulo(-this.columns[c], 3)]);
      }
      return results;
    },
    roundAll: function() {
      var c, j, len, ref, results;
      ref = [0, 1, 2];
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        c = ref[j];
        results.push(this.columns[c] = modulo(Math.round(this.columns[c]), 3));
      }
      return results;
    },
    pointerdown: function(arg) {
      var column, dims, x, y;
      x = arg.x, y = arg.y;
      if (!((x != null) && (y != null))) {
        return;
      }
      this.roundAll();
      dims = this.getDims();
      if (inRect(dims.column0, x, y)) {
        column = 0;
      } else if (inRect(dims.column1, x, y)) {
        column = 1;
      } else if (inRect(dims.column2, x, y)) {
        column = 2;
      } else {
        return;
      }
      this.pointerInfo = {
        y: y,
        column: column,
        started: this.columns[column]
      };
      return this.pointermove({
        x: x,
        y: y
      });
    },
    pointerup: function(arg) {
      var x, y;
      x = arg.x, y = arg.y;
      if (!((x != null) && (y != null))) {
        return;
      }
      if (this.pointerInfo == null) {
        return;
      }
      this.pointermove({
        x: x,
        y: y
      });
      this.roundAll();
      return this.pointerInfo = null;
    },
    pointermove: function(arg) {
      var x, y;
      x = arg.x, y = arg.y;
      if (!((x != null) && (y != null))) {
        return;
      }
      if (this.pointerInfo == null) {
        return;
      }
      return this.columns[this.pointerInfo.column] = modulo(this.pointerInfo.started + (y - this.pointerInfo.y) / this.getDims().row.h, 3);
    },
    submit: function() {
      var words;
      words = this.getWords();
      if (words[0] === 'Good' && words[1] === 'Day' && words[2] === 'Relative') {
        return ARIS.exitToDialog(languageGameSuccess);
      } else {
        return ARIS.exitToDialog(languageGameFailure);
      }
    }
  };

  allReady = function() {
    return window.game = playground({
      create: function() {},
      ready: function() {
        return this.setState(Spinner);
      },
      container: document.getElementById('the-table')
    });
  };

  readies = 2;

  oneReady = function() {
    readies--;
    if (readies === 0) {
      return allReady();
    }
  };

  window.ARIS = {
    ready: oneReady
  };

  document.addEventListener('DOMContentLoaded', oneReady);

}).call(this);
