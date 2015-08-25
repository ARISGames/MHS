class Loader
  constructor: ->
    @queued = 0
    @waiting = []

  # Adds some object with a "load" method to the queue.
  # The load method should return immediately and call its callback when loaded.
  queue: (loadable) ->
    @queued++
    loadable.load =>
      @queued--
      if @queued is 0
        callback() for callback in @waiting
        @waiting = []

  # Makes a new image with the given URL and adds it to the loading queue.
  image: (url) ->
    img = new Image()
    @queue $(img)
    img.src = url
    img

  # Runs the callback the next time the queue is empty.
  afterLoad: (callback) ->
    if @queued is 0
      setTimeout callback, 0
    else
      @waiting.push callback

loadAll = (loadables, callback) ->
  loader = new Loader
  loader.queue x for x in loadables
  loader.afterLoad callback

class Timpsula
  constructor: (@canvas) ->
    @ctx = @canvas.getContext '2d'
    @ticks = 0
    @stage = 0
    loader = new Loader
    @imgs =
      loader.image("timpsula-#{i}.png") for i in [0..4]
    # TODO: wait for load

  tick: ->
    @ticks++
    return @

  draw: ->
    @ctx.drawImage @imgs[Math.min @stage, 4], 0, 0, @canvas.width, @canvas.height

  mousedown: (e) ->
    @stage++

class V2
  constructor: (@x, @y) ->

  plus: ({x, y}) ->
    new V2(@x + x, @y + y)

  minus: ({x, y}) ->
    new V2(@x - x, @y - y)

  times: ({x, y}) ->
    new V2(@x * x, @y * y)

  distance: ({x, y}) ->
    Math.sqrt((@x - x) ** 2 + (@y - y) ** 2)

  magnitude: ->
    @distance new V2(0, 0)

  angle: ->
    Math.atan2 @y, @x

  withMagnitude: (r) ->
    V2Polar(r, @angle())

  withAngle: (theta) ->
    V2Polar(@magnitude(), theta)

V2Polar = (r, theta) ->
  new V2(r * Math.cos(theta), r * Math.sin(theta))

$(document).ready ->
  canvas = $('#the-canvas')[0]
  window.game = new Timpsula canvas

  for evt in ['mousedown', 'mousemove', 'mouseup', 'swipe', 'swipeupdown']
    do (evt) ->
      $('#the-canvas').on evt, (e) ->
        if window.game[evt]?
          window.game[evt](e)

  resize = ->
    canvas.width = $(window).width()
    canvas.height = $(window).height()
  resize()
  $(window).resize -> resize()

  gameLoop = ->
    window.game = window.game.tick()
    window.game.draw()
    requestAnimationFrame gameLoop
  gameLoop()
