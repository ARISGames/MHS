// Generated by CoffeeScript 1.9.3
(function() {
  var Bison, Chokecherries, Timpsula;

  Timpsula = {
    create: function() {
      return this.stage = 0;
    },
    step: function() {
      if (this.stage <= 4) {
        return null;
      } else {
        return this.app.setState(Bison);
      }
    },
    render: function() {
      return this.app.layer.drawImage(this.app.images["timpsula-" + (Math.min(this.stage, 4))], 0, 0, this.app.layer.width, this.app.layer.height);
    },
    pointerdown: function(e) {
      var ref, ref1;
      if ((ref = this.stage) === 1 || ref === 2 || ref === 3) {
        this.stage++;
        return this.app.sound.play('chop');
      } else if ((ref1 = this.stage) === 0 || ref1 === 4) {
        return this.stage++;
      }
    }
  };

  Bison = {
    create: function() {
      return this.stage = 0;
    },
    step: function() {
      if (this.stage <= 6) {
        return null;
      } else {
        return this.app.setState(Chokecherries);
      }
    },
    render: function() {
      return this.app.layer.drawImage(this.app.images["bison-" + (Math.min(this.stage, 6))], 0, 0, this.app.layer.width, this.app.layer.height);
    },
    pointerdown: function(e) {
      var ref, ref1;
      if ((ref = this.stage) === 0 || ref === 1 || ref === 2 || ref === 3 || ref === 6) {
        if (this.stage === 0) {
          this.app.sound.play('fwoosh');
        }
        if (this.stage === 1) {
          this.app.sound.play('ting');
        }
        if (this.stage === 2) {
          this.app.sound.play('slap');
        }
        if (this.stage === 3) {
          this.app.sound.play('sizzle');
        }
        return this.stage++;
      } else if ((ref1 = this.stage) === 4 || ref1 === 5) {
        this.app.sound.play('slap');
        return this.stage++;
      }
    }
  };

  Chokecherries = {
    create: function() {
      return this.stage = 0;
    },
    step: function() {},
    render: function() {
      return this.app.layer.drawImage(this.app.images["chokecherries-" + (Math.min(this.stage, 4))], 0, 0, this.app.layer.width, this.app.layer.height);
    },
    pointerdown: function(e) {
      var ref, ref1;
      if ((ref = this.stage) === 0) {
        return this.stage++;
      } else if ((ref1 = this.stage) === 1 || ref1 === 2 || ref1 === 3) {
        this.app.sound.play('squish');
        return this.stage++;
      }
    }
  };

  $(document).ready(function() {
    return window.app = playground({
      create: function() {
        var i, j, k, l;
        for (i = j = 0; j <= 4; i = ++j) {
          this.loadImage("timpsula-" + i + ".png");
        }
        for (i = k = 0; k <= 6; i = ++k) {
          this.loadImage("bison-" + i + ".png");
        }
        for (i = l = 0; l <= 4; i = ++l) {
          this.loadImage("chokecherries-" + i + ".png");
        }
        return this.loadSounds('chop', 'fwoosh', 'ting', 'slap', 'sizzle', 'squish');
      },
      ready: function() {
        return this.setState(Timpsula);
      }
    });
  });

}).call(this);
