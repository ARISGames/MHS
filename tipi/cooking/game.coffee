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

  sound: (urls) ->
    sound = null
    @queue
      load: (cb) ->
        sound = new Howl
          urls: urls
          onload: cb
    sound

  # Runs the callback the next time the queue is empty.
  afterLoad: (callback) ->
    if @queued is 0
      setTimeout callback, 0
    else
      @waiting.push callback

loader = new Loader
timpsulaImages =
  loader.image("timpsula-#{i}.png") for i in [0..4]
bisonImages =
  loader.image("bison-#{i}.png") for i in [0..6]
chokecherryImages =
  loader.image("chokecherries-#{i}.png") for i in [0..4]
soundFormats = (name) -> loader.sound(["#{name}.ogg", "#{name}.mp3"])
chopSound = soundFormats 'chop'
fwooshSound = soundFormats 'fwoosh'
tingSound = soundFormats 'ting'
slapSound = soundFormats 'slap'
sizzleSound = soundFormats 'sizzle'
squishSound = soundFormats 'squish'

class Timpsula
  constructor: (@canvas) ->
    @ctx = @canvas.getContext '2d'
    @ticks = 0
    @stage = 0

  tick: ->
    @ticks++
    if @stage <= 4
      @
    else
      new Bison @canvas

  draw: ->
    @ctx.drawImage timpsulaImages[Math.min @stage, 4], 0, 0, @canvas.width, @canvas.height

  mousedown: (e) ->
    @stage++ if @stage in [0, 4]
  swipeupdown: (e) ->
    if @stage in [1, 2, 3]
      @stage++
      chopSound.play()

class Bison
  constructor: (@canvas) ->
    @ctx = @canvas.getContext '2d'
    @ticks = 0
    @stage = 0

  tick: ->
    @ticks++
    if @stage <= 6
      @
    else
      sizzleSound.stop()
      new Chokecherries @canvas

  draw: ->
    @ctx.drawImage bisonImages[Math.min @stage, 6], 0, 0, @canvas.width, @canvas.height

  mousedown: (e) ->
    fwooshSound.play() if @stage == 0
    tingSound.play() if @stage == 1
    slapSound.play() if @stage == 2
    sizzleSound.play() if @stage == 3
    @stage++ if @stage in [0, 1, 2, 3, 6]
  swipe: (e) ->
    if @stage in [4, 5]
      @stage++
      slapSound.play()
  swipeupdown: (e) ->
    if @stage in [4, 5]
      @stage++
      slapSound.play()

class Chokecherries
  constructor: (@canvas) ->
    @ctx = @canvas.getContext '2d'
    @ticks = 0
    @stage = 0
    loader = new Loader

  tick: ->
    @ticks++
    @

  draw: ->
    @ctx.drawImage chokecherryImages[Math.min @stage, 4], 0, 0, @canvas.width, @canvas.height

  mousedown: (e) ->
    @stage++ if @stage in [0]
  swipe: (e) ->
    if @stage in [1, 2, 3]
      @stage++
      squishSound.play()
  swipeupdown: (e) ->
    if @stage in [1, 2, 3]
      @stage++
      squishSound.play()

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

  loader.afterLoad ->
    gameLoop = ->
      window.game = window.game.tick()
      window.game.draw()
      requestAnimationFrame gameLoop
    gameLoop()
