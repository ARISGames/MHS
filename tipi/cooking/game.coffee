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

class Game
  constructor: (@canvas) ->
  tick: ->
  draw: ->
  mousedown: (v2) ->
  mouseup: (v2) ->
  mousemove: (v2) ->

$(document).ready ->
  canvas = $('#the-canvas')[0]
  window.game = new Game canvas
  handle = (mouseEvent) -> (e) ->
    {left, top} = $('#the-canvas').offset()
    window.game[mouseEvent] new V2(e.pageX - left, e.pageY - top)
  $('#the-canvas').mousedown handle('mousedown')
  $(document).mousemove handle('mousemove')
  $(document).mouseup handle('mouseup')
  resize = ->
    canvas.width = $(window).width()
    canvas.height = $(window).height()
  resize()
  $(window).resize -> resize()
  (gameLoop = ->
    window.game.tick()
    window.game.draw()
    requestAnimationFrame gameLoop
  )()
