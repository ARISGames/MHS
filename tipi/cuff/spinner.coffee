# ARIS dialog IDs
dialogDallasEnd = 47262

inRect = (rect, x, y) ->
  (rect.x <= x <= rect.x + rect.w) and (rect.y <= y <= rect.y + rect.h)

Spinner =
  create: ->
    @positions = [-892, -698, -287]
    @done = false

  step: ->

  fixX: (n) -> (n / 640) * @app.width
  fixY: (n) -> (n / 1008) * @app.height

  render: ->
    @app.layer.drawImage @app.images.bg, 0, 0, @fixX(640), @fixY(1008)
    @app.layer.drawImage @app.images.row0, @fixX(@positions[0]), @fixY(647), @fixX(1827), @fixY(108)
    @app.layer.drawImage @app.images.row1, @fixX(@positions[1]), @fixY(767), @fixX(1827), @fixY(108)
    @app.layer.drawImage @app.images.row2, @fixX(@positions[2]), @fixY(887), @fixX(1827), @fixY(108)

  onScreen: (x, y) ->
    x? and y? and (0 <= x < 640) and (0 <= y < 1008)

  pointerdown: ({x, y}) ->
    return unless x? and y?
    x = (x / @app.width) * 640
    y = (y / @app.height) * 1008
    return unless @onScreen(x, y)
    if 647 <= y < 647 + 108
      row = 0
    else if 767 <= y < 767 + 108
      row = 1
    else if 887 <= y < 887 + 108
      row = 2
    else
      return
    @clicked =
      row: row
      position: @positions[row]
      x: x

  pointerup: ({x, y}) ->
    @clicked = null
    @checkPositions()

  pointermove: ({x, y}) ->
    return unless @clicked?
    return unless x? and y?
    x = (x / @app.width) * 640
    y = (y / @app.height) * 1008
    return unless @onScreen(x, y)
    pn = @clicked.position + (x - @clicked.x)
    pn = 0 if 0 < pn
    pn = -1187 if pn < -1187
    @positions[@clicked.row] = pn

  checkPositions: ->
    return if @done
    return unless Math.abs(@positions[0] - @positions[1]) < 30
    return unless Math.abs(@positions[0] - @positions[2]) < 30
    return unless Math.abs(@positions[1] - @positions[2]) < 30
    @done = true
    setTimeout ->
      ARIS.exitToDialog dialogDallasEnd
    , 500

allReady = ->
  window.game = playground
    create: ->
      @loadImage 'bg.jpg'
      @loadImage 'row0'
      @loadImage 'row1'
      @loadImage 'row2'

    ready: ->
      @setState Spinner

    container: document.getElementById('the-box')

countdown = -1
oneReady = ->
  countdown--
  allReady() if countdown is 0
waitFor =
  [ (-> window.ARIS = ready: oneReady)
  , (-> document.addEventListener 'DOMContentLoaded', oneReady)
  ]
countdown = waitFor.length
f() for f in waitFor

# for debugging
#ARIS.exitToDialog = (d) -> console.log "exiting to dialog #{d}"
#ARIS.givePlayerItemCount = (item_id, count) -> console.log "giving player #{count} of item #{item_id}"
#ARIS.ready()
