let origX = -9999
let origY = -9999
let origZ = -9999
let r = 0

let container
let camera, controls, scene, renderer
let objects = []
let lookup = {}
var walls = []
let next_object_id = 0

let myRaycaster
let raycaster
let mouse

let side = 1100
let unit_count = 11
let side_half = side / 2
let stride = side / unit_count

let rollOverMesh, rollOverMaterial
let cubeGeo, cubeMaterial

init()
animate()
// z = forth and back
// y = up and down
// x = left and right
function remove1 () {
  var popped = objects.splice(0, 1)[0]
  scene.remove(popped)

  console.log('name: ' + popped.name)
  render()
}

function getX (units_over) {
  let x = units_over * stride
  x -= side_half
  return x
}

function getY (units_over) {
  let y = units_over * stride
  y -= side_half
  return 100
}

function getZ (units_over) {
  let z = units_over * stride
  z -= side_half
  return 100
}

function addGrids () {
  var floor = new THREE.GridHelper(side, unit_count)
  floor.position.set(0, -side_half, 0)

  var wall = new THREE.GridHelper(side, unit_count)
  wall.position.set(0, 0, -side_half)
  wall.rotation.x = Math.PI / 2
 // wall.setColors(new THREE.Color(0xffffff), new THREE.Color(0x00ff00))
  scene.add(floor)
  scene.add(wall)

  walls.push(floor)

  let up = -side_half
  let over = -side_half
  for (let i = 0; i < unit_count + 1; i++) {
    let x = 0
    let z = -side_half // push

    addText2(up, -side_half, up, z)
    up += stride

    addText2(over, over, -side_half, z + stride)
    over += stride
  }
}
function controls_setup () {
  controls = new THREE.TrackballControls(camera)
  controls.rotateSpeed = 1.0
  controls.zoomSpeed = 1.2
  controls.panSpeed = 0.8
  controls.noZoom = false
  controls.noPan = false
  controls.staticMoving = true
  controls.dynamicDampingFactor = 0.3
}

function addText2 (msg, x, y, z) {
  let laf = {
    fontsize: 48,
    borderColor: {r: 255, g: 0, b: 0, a: 1.0},
    backgroundColor: {r: 255, g: 100, b: 100, a: 0.8}
  }

  let sprite = simpleText(msg, laf)
  sprite.position.set(x, y, z)
  scene.add(sprite)
}

function reset () {
  camera.position.x = 0
  camera.position.y = 0
  camera.position.z = 1000
  camera.rotation.x = 0
  camera.rotation.y = 0
  camera.rotation.z = 0
  render()
}
function onDocumentMouseMove (event) {
  event.preventDefault()
  mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1)
  raycaster.setFromCamera(mouse, camera)
  var intersects = raycaster.intersectObjects(walls)
  if (intersects.length > 0) {
    var intersect = intersects[ 0 ]
    try {
      rollOverMesh.position.copy(intersect.point)// .add(intersect.face.normal)
      rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
    } catch (boom) {
      console.log('FAIL: ' + boom)
    }
  }
  render()
}

function init () {
  container = document.createElement('div')
  document.body.appendChild(container)
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000)
  camera.position.z = 1000

  controls_setup()
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xffffff)
  addGrids()

  var rollOverGeo = new THREE.BoxGeometry(100, 100, 100)
  rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff6633, opacity: 0.6, transparent: true })
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
  scene.add(rollOverMesh)

  populateBodyPartSphere(getX(2), getY(2), getZ(2), stride / 2, 16, 16)
  populateBodyPartBox(getX(3), getY(2), getZ(2), stride, stride, stride)
  populateBodyPartBox(getX(6), getY(2), getZ(2), stride, stride, stride)

  myRaycaster = new THREE.Raycaster()
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  var dragControls = new THREE.DragControls(objects, camera, renderer.domElement)
  dragControls.addEventListener('dragstart', function (event) { controls.enabled = false })
  dragControls.addEventListener('dragend', function (event) { controls.enabled = true })

  window.addEventListener('resize', onWindowResize, false)
  document.addEventListener('mousedown', onDocumentMouseDown, false)
  document.addEventListener('mousemove', onDocumentMouseMove, false)
}

function onWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate () {
  requestAnimationFrame(animate)
  render()
}

function render () {
//  console.log("controls: " + )

//  const unitHeight = -2.0 * camera.position.z * Math.tan(fov / 2)
//  scaleFactor = unitHeight / this.viewer.height

  if (camera.position.x != origX || camera.position.y != origY || camera.position.z != origZ) {
    console.log(++r + '  CAMERA X: ' + camera.position.x + '  Y: ' + camera.position.y + '    Z: ' + camera.position.z + ' rot ' + camera.rotation.x + '   y  ' + camera.rotation.y + ' z ' + camera.rotation.z)
    origX = camera.position.x
    origY = camera.position.y
    origZ = camera.position.z
  }

  controls.update()
  renderer.render(scene, camera)
}

function onDocumentMouseDown (event) {
  event.preventDefault()

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  myRaycaster.setFromCamera(mouse, camera)

  var intersects = myRaycaster.intersectObjects(objects)
  if (intersects.length > 0) {
    let here = intersects[0]
    var geometry = new THREE.BoxGeometry(20, 20, 20)
    var meshMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000, opacity: 1.0, transparent: false })
    var object = new THREE.Mesh(geometry, meshMaterial)
    object.position.x = here.point.x
    object.position.y = here.point.y
    object.position.z = here.point.z
    object.castShadow = false
    object.receiveShadow = false
    scene.add(object)
  }
}

function populateBodyPartSphere (x, y, z, radius, widthSegments, heightSegments) {
  // var geometry = new THREE.SphereGeometry(100, 16, 16)

  /// OUTER
  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
  var meshMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.5, transparent: true })
  var object = new THREE.Mesh(geometry, meshMaterial)
  object.position.x = x// Math.random() * 1000 - 500
  object.position.y = y// Math.random() * 600 - 300
  object.position.z = z// Math.random() * 800 - 400

  object.castShadow = false
  object.receiveShadow = false
  object.name = ++next_object_id
  scene.add(object)
  objects.push(object)

  /// INNER
  console.log('INEER BAMY ! ')
  var geometry = new THREE.SphereGeometry((radius - 10), widthSegments, heightSegments)
  var meshMaterial2 = new THREE.LineBasicMaterial({ color: 0xff6633, opacity: 0.4, transparent: true })
  var object2 = new THREE.Mesh(geometry, meshMaterial2)
  object2.position.x = x// + 40 // Math.random() * 1000 - 500
  object2.position.y = y// + 40 // Math.random() * 600 - 300
  object2.position.z = z// + 40 // Math.random() * 800 - 400

  object2.castShadow = false
  object2.receiveShadow = false
  object2.name = ++next_object_id
  scene.add(object2)
  objects.push(object2)
}

function populateBodyPartBox (x, y, z, one, two, three) {
  next_object_id++
  // var geometry = new THREE.SphereGeometry(100, 16, 16)
  var geometry = new THREE.BoxGeometry(one, two, three)

  var meshMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.1, transparent: true })
  var object = new THREE.Mesh(geometry, meshMaterial)
  object.position.x = x// Math.random() * 1000 - 500
  object.position.y = y// Math.random() * 600 - 300
  object.position.z = z// Math.random() * 800 - 400

  object.castShadow = false
  object.receiveShadow = false
  object.name = next_object_id

  scene.add(object)
  objects.push(object)

/*
  let a_little = 20
  let side = stride - (a_little * 2)
  populateBodyPartBox(getX(6) + a_little, getY(2), getZ(2), side, side, side)

*/
}

console.log('Nice examples: https://stemkoski.github.io/Three.js/Mouse-Click.html')
