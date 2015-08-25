Timpsula =
  create: ->
    @stage = 0

  step: ->
    if @stage <= 4
      null
    else
      @app.setState Bison

  render: ->
    @app.layer.drawImage @app.images["timpsula-#{Math.min @stage, 4}"], 0, 0, @app.layer.width, @app.layer.height

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
    @app.layer.drawImage @app.images["bison-#{Math.min @stage, 6}"], 0, 0, @app.layer.width, @app.layer.height

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
    @app.layer.drawImage @app.images["chokecherries-#{Math.min @stage, 4}"], 0, 0, @app.layer.width, @app.layer.height

  pointerdown: (e) ->
    if @stage in [0]
      @stage++
    else if @stage in [1, 2, 3]
      @app.sound.play 'squish'
      @stage++

$(document).ready ->
  window.app = playground
    create: ->
      @loadImage("timpsula-#{i}.png") for i in [0..4]
      @loadImage("bison-#{i}.png") for i in [0..6]
      @loadImage("chokecherries-#{i}.png") for i in [0..4]
      @loadSounds 'chop', 'fwoosh', 'ting', 'slap', 'sizzle', 'squish'

    ready: ->
      @setState Timpsula
