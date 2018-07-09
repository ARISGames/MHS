'use strict';

// Generated by CoffeeScript 2.3.0
(function () {
  window.sashaInteractive = function (steps, dialogID) {
    var allReady, drawCenter, images, loaders, oneReady, readies, showReloadAfterWait, sounds, spinner, spinnerElement, spinnerOpts, startLoading;
    drawCenter = function drawCenter(canvas, ctx, image) {
      var h, imageRatio, layerRatio, w, x, y;
      layerRatio = canvas.width / canvas.height;
      imageRatio = image.width / image.height;
      if (layerRatio < imageRatio) {
        // layer is narrower than image, bars on top and bottom
        w = canvas.width;
        h = canvas.width / imageRatio;
      } else {
        // image is narrower than layer, bars on left and right
        w = imageRatio * canvas.height;
        h = canvas.height;
      }
      x = (canvas.width - w) / 2;
      y = (canvas.height - h) / 2;
      return ctx.drawImage(image, x, y, w, h);
    };
    images = {};
    sounds = {};
    spinnerOpts = {
      lines: 13, // The number of lines to draw
      length: 30, // The length of each line
      width: 6, // The line thickness
      radius: 19, // The radius of the inner circle
      scale: 1, // Scales overall size of the spinner
      corners: 1, // Corner roundness (0..1)
      color: '#ffffff', // CSS color or array of colors
      fadeColor: 'transparent', // CSS color or array of colors
      speed: 1, // Rounds per second
      rotate: 0, // The rotation offset
      animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
      direction: 1, // 1: clockwise, -1: counterclockwise
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      className: 'spinner', // The CSS class to assign to the spinner
      top: '50%', // Top position relative to parent
      left: '50%', // Left position relative to parent
      shadow: '0 0 1px transparent', // Box-shadow for the lines
      position: 'absolute' // Element positioning
    };
    spinner = null;
    spinnerElement = null;
    document.addEventListener('DOMContentLoaded', function () {
      spinnerElement = document.getElementById('the-spinner');
      return spinner = new Spinner(spinnerOpts).spin(spinnerElement);
    });
    allReady = function allReady() {
      var canvas, ctx, nextStep, step;
      spinner.stop();
      spinnerElement.parentNode.removeChild(spinnerElement);
      document.getElementById('the-reload').style.display = 'none';
      canvas = document.getElementById('the-canvas');
      ctx = canvas.getContext('2d');
      step = -1;
      nextStep = function nextStep() {
        var image, sound;
        step++;
        if (steps[step] != null) {
          var _steps$step = steps[step];
          image = _steps$step.image;
          sound = _steps$step.sound;

          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          if (image != null) {
            drawCenter(canvas, ctx, images[image]);
          }
          if (sound != null) {
            return sounds[sound].play();
          }
        } else {
          return window.ARIS.exitToDialog(dialogID);
        }
      };
      // canvas.addEventListener 'mousedown', nextStep
      canvas.addEventListener('touchstart', nextStep);
      Origami.fastclick(document.body);
      return nextStep();
    };
    loaders = [];
    showReloadAfterWait = function showReloadAfterWait() {
      return setTimeout(function () {
        return document.getElementById('the-reload').style.display = 'flex';
      }, 5000);
    };
    window.doReload = function () {
      loaders.forEach(function (x) {
        return x();
      });
      document.getElementById('the-reload').style.display = 'none';
      return showReloadAfterWait();
    };
    startLoading = function startLoading() {
      var loadDone, startedImages, startedSounds;
      showReloadAfterWait();
      loadDone = function loadDone(x) {
        var prevLength;
        prevLength = loaders.length;
        loaders = loaders.filter(function (y) {
          return x !== y;
        });
        if (loaders.length === 0 && prevLength > 0) {
          return allReady();
        }
      };
      startedImages = {};
      startedSounds = {};
      return steps.forEach(function (_ref) {
        var image = _ref.image,
            sound = _ref.sound;

        var _thisImage, _thisSound;
        if (image != null && startedImages[image] == null) {
          startedImages[image] = true;
          _thisImage = function thisImage() {
            var img;
            img = new Image();
            img.onload = function () {
              images[image] = img;
              return loadDone(_thisImage);
            };
            return img.src = 'images/' + image;
          };
          loaders.push(_thisImage);
          _thisImage();
        }
        if (sound != null && startedSounds[sound] == null) {
          startedSounds[sound] = true;
          _thisSound = function thisSound() {
            return sounds[sound] = new Howl({
              src: ['sounds/' + sound + '.ogg', 'sounds/' + sound + '.mp3'],
              onload: function onload() {
                return loadDone(_thisSound);
              }
            });
          };
          loaders.push(_thisSound);
          return _thisSound();
        }
      });
    };
    readies = 2;
    oneReady = function oneReady() {
      readies--;
      if (readies === 0) {
        return startLoading();
      }
    };
    window.ARIS = {
      ready: oneReady
    };
    return document.addEventListener('DOMContentLoaded', oneReady);
  };
}).call(undefined);

