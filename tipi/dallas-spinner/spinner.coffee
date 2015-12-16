# ARIS dialog IDs
dialogDallasEnd = 47262
wordMap =
  [ { Happy: 59806
    , Sad: 59807
    , Calm: 59810
    }
  , { Creative: 59812
    , Confused: 59813
    , Surprised: 59815
    }
  , { Curious: 59817
    , Thoughtful: 59819
    , Excited: 59822
    }
  ]

inRect = (rect, x, y) ->
  (rect.x <= x <= rect.x + rect.w) and (rect.y <= y <= rect.y + rect.h)

Spinner =
  create: ->
    @columns = [0, 0, 0]
    @pointerInfo = null
    @words =
      for column in wordMap
        word for word of column

  step: ->

  getDims: ->
    colWidth = (@app.layer.width - 10) / 3
    column0:
      x: 5
      y: 5
      w: colWidth
      h: @app.layer.height - 10
    column1:
      x: 5 + colWidth
      y: 5
      w: colWidth
      h: @app.layer.height - 10
    column2:
      x: 5 + colWidth + colWidth
      y: 5
      w: colWidth
      h: @app.layer.height - 10
    row:
      w: @app.layer.width - 10
      h: (@app.layer.height - 10) / 3

  render: ->
    dims = @getDims()
    @app.layer.clear 'black'
    @app.layer.globalAlpha 1
    @app.layer.strokeStyle 'black'
    @app.layer.lineWidth 7
    fillColors = ['#48b', '#8b4', '#b58']
    for col, i in [dims.column0, dims.column1, dims.column2]
      @app.layer.fillStyle fillColors[i]
      @app.layer.fillRect col.x, col.y, col.w, col.h
      @app.layer.strokeRect col.x, col.y, col.w, col.h
    @app.layer.lineWidth 1
    for r in [0, 1, 2]
      col = dims["column#{r}"]
      rowOffset = @columns[r] % 1
      for i in [0, 1, 2]
        y = col.y + (i + rowOffset) * dims.row.h
        @app.layer.strokeLine col.x, y, col.x + col.w, y
    @app.layer.textAlign 'center'
    @app.layer.textBaseline 'middle'
    @app.layer.fillStyle 'black'
    @app.layer.font "#{@app.layer.height / 10}px sans-serif"
    for c in [0, 1, 2]
      col = dims["column#{c}"]
      for r in [0, 1, 2]
        y = col.y + col.h / 2 + (@columns[c] + r) * dims.row.h
        for repeat in [-2, -1, 0]
          @app.layer.fillText @words[c][r], col.x + col.w / 2, y + dims.column1.h * repeat
    @app.layer.fillStyle 'black'
    @app.layer.globalAlpha 0.3
    @app.layer.fillRect dims.column0.x, dims.column0.y, dims.row.w, dims.row.h
    @app.layer.fillRect dims.column0.x, dims.column0.y + 2 * dims.row.h, dims.row.w, dims.row.h

  getWords: ->
    @words[c][-(@columns[c]) %% 3] for c in [0, 1, 2]

  roundAll: ->
    for c in [0, 1, 2]
      @columns[c] = Math.round(@columns[c]) %% 3

  pointerdown: ({x, y}) ->
    return unless x? and y?
    @roundAll()
    dims = @getDims()
    if inRect dims.column0, x, y
      column = 0
    else if inRect dims.column1, x, y
      column = 1
    else if inRect dims.column2, x, y
      column = 2
    else
      return
    @pointerInfo =
      y: y
      column: column
      started: @columns[column]
    @pointermove {x, y}

  pointerup: ({x, y}) ->
    return unless x? and y?
    return unless @pointerInfo?
    @pointermove {x, y}
    @roundAll()
    @pointerInfo = null

  pointermove: ({x, y}) ->
    return unless x? and y?
    return unless @pointerInfo?
    @columns[@pointerInfo.column] = (@pointerInfo.started + (y - @pointerInfo.y) / @getDims().row.h) %% 3

  submit: ->
    words = @getWords()
    for word, i in words
      for possibleWord, wordItem of wordMap[i]
        if word is possibleWord
          ARIS.givePlayerItemCount wordItem, 1
    ARIS.exitToDialog dialogDallasEnd

allReady = ->
  window.game = playground
    create: ->
      # @loadImage 'something'
      # @loadSounds 'whatever'

    ready: ->
      @setState Spinner

    container: document.getElementById('the-table')

readies = 2
oneReady = ->
  readies--
  allReady() if readies is 0
window.ARIS = ready: oneReady
document.addEventListener 'DOMContentLoaded', oneReady

# for debugging
#ARIS.exitToDialog = (d) -> console.log "exiting to dialog #{d}"
#ARIS.givePlayerItemCount = (item_id, count) -> console.log "giving player #{count} of item #{item_id}"
#ARIS.ready()
