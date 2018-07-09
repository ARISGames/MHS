# ARIS dialog IDs
sashaBeforeStep1 = 29449
sashaBeforeStep2 = 33976
sashaBeforeStep3 = 33978
sashaBeforeStep4 = 53383
sashaEnd = 28522

drawCenter = (canvas, ctx, image) ->
  layerRatio = canvas.width / canvas.height
  imageRatio = image.width / image.height
  if layerRatio < imageRatio
    # layer is narrower than image, bars on top and bottom
    w = canvas.width
    h = canvas.width / imageRatio
  else
    # image is narrower than layer, bars on left and right
    w = imageRatio * canvas.height
    h = canvas.height
  x = (canvas.width - w) / 2
  y = (canvas.height - h) / 2
  ctx.drawImage image, x, y, w, h

images = {}
sounds = {}
steps =
  [ { image: "bison-0.jpg" }
  , { image: "bison-1.jpg", sound: "fwoosh" }
  , { image: "bison-2.jpg", sound: "ting" }
  , { image: "bison-3.jpg", sound: "slap" }
  , { image: "bison-4.jpg", sound: "sizzle" }
  , { image: "bison-5.jpg", sound: "slap" }
  , { image: "bison-6.jpg", sound: "slap" }
  ]

spinnerOpts =
  lines: 13 # The number of lines to draw
  length: 38 # The length of each line
  width: 17 # The line thickness
  radius: 45 # The radius of the inner circle
  scale: 1 # Scales overall size of the spinner
  corners: 1 # Corner roundness (0..1)
  color: '#ffffff' # CSS color or array of colors
  fadeColor: 'transparent' # CSS color or array of colors
  speed: 1 # Rounds per second
  rotate: 0 # The rotation offset
  animation: 'spinner-line-fade-quick' # The CSS animation name for the lines
  direction: 1 # 1: clockwise, -1: counterclockwise
  zIndex: 2e9 # The z-index (defaults to 2000000000)
  className: 'spinner' # The CSS class to assign to the spinner
  top: '50%' # Top position relative to parent
  left: '50%' # Left position relative to parent
  shadow: '0 0 1px transparent' # Box-shadow for the lines
  position: 'absolute' # Element positioning
spinner = null
spinnerElement = null
document.addEventListener 'DOMContentLoaded', ->
  spinnerElement = document.getElementById('the-spinner')
  spinner = new Spinner(spinnerOpts).spin(spinnerElement)

allReady = ->

  spinner.stop()
  spinnerElement.parentNode.removeChild(spinnerElement)
  canvas = document.getElementById 'the-canvas'
  ctx = canvas.getContext '2d'

  step = -1
  nextStep = ->
    step++
    if steps[step]?
      {image, sound} = steps[step]
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.fillStyle = 'white'
      ctx.fillRect 0, 0, canvas.width, canvas.height
      if image?
        drawCenter canvas, ctx, images[image]
      if sound?
        sounds[sound].play()
    else
      window.ARIS.exitToDialog sashaBeforeStep3
  # canvas.addEventListener 'mousedown', nextStep
  canvas.addEventListener 'touchstart', nextStep

  Origami.fastclick document.body

  nextStep()

startLoading = ->
  loaders = []
  loadDone = (x) ->
    prevLength = loaders.length
    loaders = loaders.filter (y) -> x isnt y
    if loaders.length is 0 and prevLength > 0
      allReady()
  startedImages = {}
  startedSounds = {}
  steps.forEach ({image, sound}) ->
    if image? and not startedImages[image]?
      startedImages[image] = true
      thisImage = ->
        img = new Image
        img.onload = ->
          images[image] = img
          loadDone thisImage
        img.src = "images/#{image}"
      loaders.push thisImage
      thisImage()
    if sound? and not startedSounds[sound]?
      startedSounds[sound] = true
      thisSound = ->
        sounds[sound] = new Howl
          src: ["sounds/#{sound}.ogg", "sounds/#{sound}.mp3"]
          onload: ->
            loadDone thisSound
      loaders.push thisSound
      thisSound()

readies = 2
oneReady = ->
  readies--
  startLoading() if readies is 0
window.ARIS = ready: oneReady
document.addEventListener 'DOMContentLoaded', oneReady
