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
      @app.setState Bison

  render: ->
    @app.layer.clear 'white'
    drawCenter @app.layer, @app.images["timpsula-#{Math.min @stage, 4}"]

  pointerdown: (e) ->
    if @stage in [1, 2, 3]
      @stage++
      @app.sound.play 'chop'
    else if @stage in [0, 4]
      @stage++

Bison =
  create: ->
    @stage = 0

  step: ->
    if @stage <= 6
      null
    else
      # @app.sound.stop 'sizzle'
      @app.setState Chokecherries

  render: ->
    @app.layer.clear 'white'
    drawCenter @app.layer, @app.images["bison-#{Math.min @stage, 6}"]

  pointerdown: (e) ->
    if @stage in [0, 1, 2, 3, 6]
      @app.sound.play 'fwoosh' if @stage == 0
      @app.sound.play 'ting' if @stage == 1
      @app.sound.play 'slap' if @stage == 2
      @app.sound.play 'sizzle' if @stage == 3
      @stage++
    else if @stage in [4, 5]
      @app.sound.play 'slap'
      @stage++

Chokecherries =
  create: ->
    @stage = 0

  step: ->

  render: ->
    @app.layer.clear 'white'
    drawCenter @app.layer, @app.images["chokecherries-#{Math.min @stage, 4}"]

  pointerdown: (e) ->
    if @stage in [0]
      @stage++
    else if @stage in [1, 2, 3]
      @app.sound.play 'squish'
      @stage++
    else if @stage is 4
      window.ARIS.exitToDialog 28522

allReady = ->
  window.game = playground
    create: ->
      @loadImage("timpsula-#{i}.png") for i in [0..4]
      @loadImage("bison-#{i}.png") for i in [0..6]
      @loadImage("chokecherries-#{i}.png") for i in [0..4]
      @loadSounds 'chop', 'fwoosh', 'ting', 'slap', 'sizzle', 'squish'
    ready: ->
      @setState Timpsula

readies = 2
oneReady = ->
  readies--
  allReady() if readies is 0
window.ARIS = ready: oneReady
document.addEventListener 'DOMContentLoaded', oneReady
