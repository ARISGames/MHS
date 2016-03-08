// Generated by CoffeeScript 1.9.3
(function() {
  var allReady, drawCenter, imgs, loadImage, loadImages, oneReady, readies, sashaAfterCooking, sashaBeforeStep1, sashaBeforeStep2, sashaBeforeStep3, sounds, steps;

  sashaBeforeStep1 = 29449;

  sashaBeforeStep2 = 33976;

  sashaBeforeStep3 = 33978;

  sashaAfterCooking = 28522;

  drawCenter = function(canvas, ctx, image) {
    var h, imageRatio, layerRatio, w, x, y;
    layerRatio = canvas.width / canvas.height;
    imageRatio = image.width / image.height;
    if (layerRatio < imageRatio) {
      w = canvas.width;
      h = canvas.width / imageRatio;
    } else {
      w = imageRatio * canvas.height;
      h = canvas.height;
    }
    x = (canvas.width - w) / 2;
    y = (canvas.height - h) / 2;
    return ctx.drawImage(image, x, y, w, h);
  };

  loadImage = function(src, cb) {
    var img;
    img = new Image;
    img.onload = function() {
      return cb(img);
    };
    return img.src = src;
  };

  sounds = {};

  steps = [
    {
      image: "chokecherries-0.jpg"
    }, {
      image: "chokecherries-1.jpg"
    }, {
      image: "chokecherries-2.jpg"
    }, {
      image: "chokecherries-3.jpg"
    }, {
      image: "chokecherries-4.jpg"
    }, {
      image: "chokecherries-5.jpg"
    }, {
      image: "chokecherries-6.jpg",
      sound: "squish"
    }, {
      image: "chokecherries-7.jpg",
      sound: "squish"
    }, {
      image: "chokecherries-8.jpg",
      sound: "squish"
    }, {
      image: "chokecherries-9.jpg",
      sound: "squish"
    }, {
      image: "chokecherries-10.jpg",
      sound: "squish"
    }
  ];

  imgs = {};

  loadImages = function(cb) {
    var count, fn, i, image, len;
    count = steps.length;
    fn = function(image) {
      return loadImage("images/" + image, function(img) {
        imgs[image] = img;
        count--;
        if (count === 0) {
          return cb();
        }
      });
    };
    for (i = 0, len = steps.length; i < len; i++) {
      image = steps[i].image;
      fn(image);
    }
    return void 0;
  };

  allReady = function() {
    var canvas, clickListener, ctx, nextStep, step;
    canvas = document.getElementById('the-canvas');
    ctx = canvas.getContext('2d');
    clickListener = null;
    step = -1;
    nextStep = function() {
      var image, ref, sound;
      step++;
      if (steps[step] != null) {
        ref = steps[step], image = ref.image, sound = ref.sound;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (image != null) {
          drawCenter(canvas, ctx, imgs[image]);
        }
        if (sound != null) {
          return sounds[sound].play();
        }
      } else {
        return window.ARIS.exitToDialog(sashaAfterCooking);
      }
    };
    canvas.addEventListener('touchstart', nextStep);
    Origami.fastclick(document.body);
    return loadImages(nextStep);
  };

  readies = 3;

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

  sounds['squish'] = new Howl({
    src: ['sounds/squish.ogg', 'sounds/squish.mp3'],
    onload: oneReady
  });

}).call(this);