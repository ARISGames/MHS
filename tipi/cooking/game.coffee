class Timpsula
  constructor: ->
    @ticks = 0
    @stage = 0

  tick: (pg) ->
    @ticks++
    if @stage <= 4
      @
    else
      new Bison

  draw: (pg) ->
    pg.layer.drawImage pg.images["timpsula-#{Math.min @stage, 4}"], 0, 0, pg.layer.width, pg.layer.height

  pointerdown: (e, pg) ->
    if @stage in [1, 2, 3]
      @stage++
      pg.sound.play 'chop'
    else if @stage in [0, 4]
      @stage++

class Bison
  constructor: ->
    @ticks = 0
    @stage = 0

  tick: (pg) ->
    @ticks++
    if @stage <= 6
      @
    else
      # pg.sound.stop 'sizzle'
      new Chokecherries

  draw: (pg) ->
    pg.layer.drawImage pg.images["bison-#{Math.min @stage, 6}"], 0, 0, pg.layer.width, pg.layer.height

  pointerdown: (e, pg) ->
    if @stage in [0, 1, 2, 3, 6]
      pg.sound.play 'fwoosh' if @stage == 0
      pg.sound.play 'ting' if @stage == 1
      pg.sound.play 'slap' if @stage == 2
      pg.sound.play 'sizzle' if @stage == 3
      @stage++
    else if @stage in [4, 5]
      pg.sound.play 'slap'
      @stage++

class Chokecherries
  constructor: ->
    @ticks = 0
    @stage = 0

  tick: (pg) ->
    @ticks++
    @

  draw: (pg) ->
    pg.layer.drawImage pg.images["chokecherries-#{Math.min @stage, 4}"], 0, 0, pg.layer.width, pg.layer.height

  pointerdown: (e, pg) ->
    if @stage in [0]
      @stage++
    else if @stage in [1, 2, 3]
      pg.sound.play 'squish'
      @stage++

$(document).ready ->

  window.game = new Timpsula
  window.app = playground

    create: ->
      @loadImage("timpsula-#{i}.png") for i in [0..4]
      @loadImage("bison-#{i}.png") for i in [0..6]
      @loadImage("chokecherries-#{i}.png") for i in [0..4]
      @loadSounds 'chop', 'fwoosh', 'ting', 'slap', 'sizzle', 'squish'

    step: ->
      window.game = window.game.tick @
    
    render: ->
      window.game.draw @

    pointerdown: (e) ->
      window.game.pointerdown(e, @) if window.game['pointerdown']?
    pointermove: (e) ->
      window.game.pointermove(e, @) if window.game['pointermove']?
    pointerup: (e) ->
      window.game.pointerup(e, @) if window.game['pointerup']?
