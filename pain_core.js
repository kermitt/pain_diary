
let container
let camera, controls, scene, renderer
let objects = []
let lookup = {}
var walls = []
let next_object_id = 0

let myRaycaster
let raycaster
let mouse
let everypart = {}

let side = 1100
let unit_count = 11
let side_half = side / 2
let stride = side / unit_count

let rollOverMesh, rollOverMaterial
let cubeGeo, cubeMaterial

init()
animate()

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

function onDocumentMouseMove (event) {
  snapto(event)

  /*
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
  */
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

  // var rollOverGeo = new THREE.BoxGeometry(100, 100, 100)
  // rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff6633, opacity: 0.6, transparent: true })
  // rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
  // scene.add(rollOverMesh)

  // populateBodyPartSphere(getX(2), getY(2), getZ(2), stride / 2, 16, 16)
  // populateBodyPartBox(getX(3), getY(2), getZ(2), stride, stride, stride)
  // populateBodyPartBox(getX(6), getY(2), getZ(2), stride, stride, stride)

  myRaycaster = new THREE.Raycaster()
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  container.appendChild(renderer.domElement)

  // var dragControls = new THREE.DragControls(objects, camera, renderer.domElement)
  // dragControls.addEventListener('dragstart', function (event) { controls.enabled = false })
  // dragControls.addEventListener('dragend', function (event) { controls.enabled = true })

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
  controls.update()
  renderer.render(scene, camera)
}

function onDocumentMouseDown (event) {
  event.preventDefault()

  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  myRaycaster.setFromCamera(mouse, camera)

  let objs = []
//  everypart.forEach((name, i) => {
  for (let key in everypart) {
    let o = scene.getObjectByName(key)
    objs.push(o)
  }
  var intersects = myRaycaster.intersectObjects(objs)
  if (intersects.length > 0) {
    let here = intersects[0]

    console.log('here! ' + here.point.x + '   event ' + event.x)

    var geometry = new THREE.BoxGeometry(20, 20, 20)
    var meshMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true })
    var pointOfInterest = new THREE.Mesh(geometry, meshMaterial)
    pointOfInterest.position.x = here.point.x + 20
    pointOfInterest.position.y = here.point.y + 20
    pointOfInterest.position.z = here.point.z
    pointOfInterest.castShadow = true
    pointOfInterest.receiveShadow = true
    scene.add(pointOfInterest)
  }

  // + ---------------------------------- +
  var vector = new THREE.Vector3()
  vector.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5)
  vector.unproject(camera)
  var dir = vector.sub(camera.position).normalize()
  var distance = -camera.position.z / dir.z / 2
  var pos = camera.position.clone().add(dir.multiplyScalar(distance))

  console.log('d2 x ' + event.x + '  ' + event.y + '  pos ' + pos.x + '  ' + pos.y + ' distance  ' + distance)

  var geometry = new THREE.BoxGeometry(30, 30, 30)
  var meshMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, opacity: 1.0, transparent: true })
  var pointOfInterest = new THREE.Mesh(geometry, meshMaterial)
  pointOfInterest.position.x = pos.x
  pointOfInterest.position.y = pos.y
  pointOfInterest.position.z = getZ(5.5)
  pointOfInterest.castShadow = true
  pointOfInterest.receiveShadow = true
  scene.add(pointOfInterest)
}

// console.log('Nice examples: https://stemkoski.github.io/Three.js/Mouse-Click.html')
