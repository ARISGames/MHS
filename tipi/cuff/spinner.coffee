# ARIS dialog IDs

inRect = (rect, x, y) ->
  (rect.x <= x <= rect.x + rect.w) and (rect.y <= y <= rect.y + rect.h)

Spinner =
  create: ->
    @positions = [-892, -698, -287]

  step: ->

  render: ->
    @app.layer.drawImage @app.images.bg, 0, 0
    @app.layer.drawImage @app.images.row1, @positions[0], 647
    @app.layer.drawImage @app.images.row2, @positions[1], 767
    @app.layer.drawImage @app.images.row3, @positions[2], 887

  pointerdown: ({x, y}) ->
    return unless x? and y?

  pointerup: ({x, y}) ->
    return unless x? and y?

  pointermove: ({x, y}) ->
    return unless x? and y?

allReady = ->
  window.game = playground
    create: ->
      @loadImage 'bg.jpg'
      @loadImage 'row1'
      @loadImage 'row2'
      @loadImage 'row3'

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
ARIS.exitToDialog = (d) -> console.log "exiting to dialog #{d}"
ARIS.givePlayerItemCount = (item_id, count) -> console.log "giving player #{count} of item #{item_id}"
ARIS.ready()
