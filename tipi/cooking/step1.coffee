# ARIS dialog IDs
sashaBeforeStep1 = 29449
sashaBeforeStep2 = 33976
sashaBeforeStep3 = 33978
sashaAfterCooking = 28522

drawCenter = (layer, image) ->
  layerRatio = layer.width / layer.height
  imageRatio = image.width / image.height
  if layerRatio < imageRatio
    # layer is narrower than image, bars on top and bottom
    w = layer.width
    h = layer.width / imageRatio
  else
    # image is narrower than layer, bars on left and right
    w = imageRatio * layer.height
    h = layer.height
  x = (layer.width - w) / 2
  y = (layer.height - h) / 2
  layer.drawImage image, x, y, w, h

Timpsula =
  create: ->
    @stage = 0

  step: ->
    if @stage <= 4
      null
    else
      window.ARIS.exitToDialog sashaBeforeStep2

  render: ->
    @app.layer.clear 'white'
    drawCenter @app.layer, @app.images["timpsula-#{Math.min @stage, 4}"]

  pointerdown: (e) ->
    if @stage in [1, 2, 3]
      @stage++
      @app.sound.play 'chop'
    else if @stage in [0, 4]
      @stage++

allReady = ->
  window.game = playground
    create: ->
      @loadImage("timpsula-#{i}.png") for i in [0..4]
      @loadSounds 'chop'
    ready: ->
      @setState Timpsula

readies = 2
oneReady = ->
  readies--
  allReady() if readies is 0
window.ARIS = ready: oneReady
document.addEventListener 'DOMContentLoaded', oneReady
