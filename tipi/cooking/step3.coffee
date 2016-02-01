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

Chokecherries =
  create: ->
    @stage = 0
    @isPointerDown = true

  step: ->

  render: ->
    @app.layer.clear 'white'
    drawCenter @app.layer, @app.images["chokecherries-#{Math.min @stage, 4}"]

  pointerdown: ({x, y}) ->
    return unless x? and y?
    @isPointerDown = true
    @x = x / @app.width
    @y = y / @app.height
    @distance = 0
    if @stage in [0]
      @stage++

  pointerup: ({x, y}) ->
    return unless x? and y?
    @isPointerDown = false

  pointermove: ({x, y}) ->
    return unless x? and y?
    return unless @isPointerDown
    oldDistance = @distance
    oldX = @x
    oldY = @y
    @x = x / @app.width
    @y = y / @app.height
    @distance += Math.sqrt((@x - oldX) ** 2 + (@y - oldY) ** 2)
    if Math.floor(oldDistance / 1.5) != Math.floor(@distance / 1.5)
      if @stage in [1, 2, 3]
        @app.sound.play 'squish'
        @stage++
      else if @stage is 4
        window.ARIS.exitToDialog sashaAfterCooking

allReady = ->
  window.game = playground
    create: ->
      @loadImage("chokecherries-#{i}.jpg") for i in [0..4]
      @loadSounds 'squish'
    ready: ->
      @setState Chokecherries

readies = 2
oneReady = ->
  readies--
  allReady() if readies is 0
window.ARIS = ready: oneReady
document.addEventListener 'DOMContentLoaded', oneReady

#ARIS.ready()
#ARIS.exitToDialog = (d) -> console.log "exiting to dialog #{d}"
