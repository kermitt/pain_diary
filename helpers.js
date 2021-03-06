console.log('roundRect() and makeTextSprint() from https://stemkoski.github.io/Three.js/Mouse-Click.html')

/*
EXAMPLE USAGE!
function addText () {
  var spritey = makeTextSprite('Example usage',
    { fontsize: 24, borderColor: {r: 255, g: 0, b: 0, a: 1.0}, backgroundColor: {r: 255, g: 100, b: 100, a: 0.8} })
  spritey.position.set(-85, 105, 55)
  scene.add(spritey)
}
*/
// function for drawing rounded rectangles
function roundRect (ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

function simpleText (message, parameters) {
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  context.font = 'Bold ' + parameters.fontsize + 'px Arial'

  let backgroundColor = parameters['backgroundColor']
  let borderColor = parameters['borderColor']
  var metrics = context.measureText(message)
  var textWidth = metrics.width
  var borderThickness = 4
  var fontsize = parameters['fontsize']

  context.fillStyle = 'rgba(0, 0, 0, 1.0)'
  context.fillText(message, borderThickness, fontsize + borderThickness)

  var texture = new THREE.Texture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.needsUpdate = true
  var spriteMaterial = new THREE.SpriteMaterial({ map: texture })
  var sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(100, 50, 1.0)
  return sprite
}

function makeTextSprite (message, parameters) {
  if (parameters === undefined) parameters = {}

  var fontface = parameters.hasOwnProperty('fontface')
    ? parameters['fontface'] : 'Arial'

  var fontsize = parameters.hasOwnProperty('fontsize')
    ? parameters['fontsize'] : 18

  var borderThickness = parameters.hasOwnProperty('borderThickness')
    ? parameters['borderThickness'] : 4

  var borderColor = parameters.hasOwnProperty('borderColor')
    ? parameters['borderColor'] : { r: 0, g: 0, b: 0, a: 1.0 }

  var backgroundColor = parameters.hasOwnProperty('backgroundColor')
    ? parameters['backgroundColor'] : { r: 255, g: 255, b: 255, a: 1.0 }

  // var spriteAlignment = THREE.SpriteAlignment.topLeft

  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  context.font = 'Bold ' + fontsize + 'px ' + fontface

  // get size data (height depends only on font size)
  var metrics = context.measureText(message)
  var textWidth = metrics.width

  // background color
  context.fillStyle = 'rgba(' + backgroundColor.r + ',' + backgroundColor.g + ',' +
                  backgroundColor.b + ',' + backgroundColor.a + ')'
  // border color
  context.strokeStyle = 'rgba(' + borderColor.r + ',' + borderColor.g + ',' +
                  borderColor.b + ',' + borderColor.a + ')'

  context.lineWidth = borderThickness
  roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6)
  // 1.4 is extra height factor for text below baseline: g,j,p,q.

  // text color
  context.fillStyle = 'rgba(0, 0, 0, 1.0)'

  context.fillText(message, borderThickness, fontsize + borderThickness)

  // canvas contents will be used for a texture
  var texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

//  var spriteMaterial = new THREE.SpriteMaterial(   { map: texture, useScreenCoordinates: false, alignment: spriteAlignment })
  var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false })

  var sprite = new THREE.Sprite(spriteMaterial)
  sprite.scale.set(100, 50, 1.0)
  return sprite
}

/// ///
function drawLines_notInUse () {
 // shape
  shape = new THREE.Shape()
  shape.moveTo(-490, -400, -100)
  shape.lineTo(40, 0, 0)
  shape.lineTo(40, 40, 0)
  shape.lineTo(0, 40, 0)
  shape.lineTo(0, 233, 3000)
//  shape.lineTo(0, 1e-10)
  // geometry
  var geometry2 = shape.makeGeometry()
  // material
  var material2 = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 40 })
// line
  let line2 = new THREE.Line(geometry2, material2)
  scene.add(line2)
}
