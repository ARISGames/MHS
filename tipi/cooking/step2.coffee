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

Bison =
  create: ->
    @stage = 0

  step: ->
    if @stage <= 6
      null
    else
      @app.sound.stop @sizzleSound
      window.ARIS.exitToDialog sashaBeforeStep3

  render: ->
    @app.layer.clear 'white'
    drawCenter @app.layer, @app.images["bison-#{Math.min @stage, 6}"]

  pointerdown: (e) ->
    if @stage in [0, 1, 2, 3, 6]
      @app.sound.play 'fwoosh' if @stage == 0
      @app.sound.play 'ting' if @stage == 1
      @app.sound.play 'slap' if @stage == 2
      if @stage == 3
        @sizzleSound = @app.sound.play 'sizzle'
      @stage++
    else if @stage in [4, 5]
      @app.sound.play 'slap'
      @stage++

allReady = ->
  window.game = playground
    create: ->
      @loadImage("bison-#{i}.jpg") for i in [0..6]
      @loadSounds 'fwoosh', 'ting', 'slap', 'sizzle'
    ready: ->
      @setState Bison

readies = 2
oneReady = ->
  readies--
  allReady() if readies is 0
window.ARIS = ready: oneReady
document.addEventListener 'DOMContentLoaded', oneReady
