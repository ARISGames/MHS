# ARIS dialog IDs
sashaBeforeStep1 = 29449
sashaBeforeStep2 = 33976
sashaBeforeStep3 = 33978
sashaAfterCooking = 28522

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

loadImage = (src, cb) ->
  img = new Image
  img.onload = -> cb img
  img.src = src

steps =
  [ { image: "chokecherries-0.jpg" }
  , { image: "chokecherries-1.jpg" }
  , { image: "chokecherries-2.jpg", sound: "squish" }
  , { image: "chokecherries-3.jpg", sound: "squish" }
  , { image: "chokecherries-4.jpg", sound: "squish" }
  ]

imgs = {}
loadImages = (cb) ->
  count = steps.length
  for {image} in steps
    do (image) ->
      loadImage "images/#{image}", (img) ->
        imgs[image] = img
        count--
        cb() if count is 0
  undefined

allReady = ->

  canvas = document.getElementById 'the-canvas'
  ctx = canvas.getContext '2d'
  clickListener = null

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
        drawCenter canvas, ctx, imgs[image]
      if sound?
        s = document.getElementById sound
        # restart audio if it's already going
        s.pause()
        s.currentTime = 0
        s.play()
    else
      window.ARIS.exitToDialog sashaAfterCooking
  # canvas.addEventListener 'mousedown', nextStep
  canvas.addEventListener 'touchstart', nextStep

  Origami.fastclick document.body

  loadImages nextStep

readies = 2
oneReady = ->
  readies--
  allReady() if readies is 0
window.ARIS = ready: oneReady
document.addEventListener 'DOMContentLoaded', oneReady
