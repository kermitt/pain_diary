
var container, stats
var camera, controls, scene, renderer
var objects = []
var walls = []

var myRaycaster
var raycaster
var mouse

let rollOverMesh, rollOverMaterial
let cubeGeo, cubeMaterial

init()
animate()
// z = forth and back
// y = up and down

function addGrids () {
  var floor = new THREE.GridHelper(1000, 20)
  floor.position.set(0, -500, 0)

  var wall = new THREE.GridHelper(1000, 20)
  wall.position.set(0, 0, -500)
  wall.rotation.x = Math.PI / 2
 // wall.setColors(new THREE.Color(0xffffff), new THREE.Color(0x00ff00))
  scene.add(floor)
  scene.add(wall)

  walls.push(floor)
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

function addText (msg, x, y, z) {
  let look_and_feel = {
    fontsize: 48,
    borderColor: {r: 255, g: 0, b: 0, a: 1.0},
    backgroundColor: {r: 255, g: 100, b: 100, a: 0.8}
  }
  // let sprite = makeTextSprite(' Hello there ', look_and_feel)
  // sprite.position.set(-85, 105, 55)
  let sprite = makeTextSprite(msg, look_and_feel)
  sprite.position.set(x, y, z)
  scene.add(sprite)
}

function addText2 (msg, x, y, z) {
  let laf = {
    fontsize: 48,
    borderColor: {r: 255, g: 0, b: 0, a: 1.0},
    backgroundColor: {r: 255, g: 100, b: 100, a: 0.8}
  }

  let sprite = simpleText('!' + msg, laf)
  sprite.position.set(x, y, z)
  scene.add(sprite)
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
      console.log('WHat?! ' + boom)
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

  for (let i = 0; i < 1; i++) {
    // wall.position.set(0, 0, -500)
    addText2(i + ' : ' + i * 20, 0, i * 20, -500)
  }

  var rollOverGeo = new THREE.BoxGeometry(50, 50, 50)
  rollOverMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.6, transparent: true })
  rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial)
  scene.add(rollOverMesh)

  var geometry = new THREE.BoxGeometry(100, 100, 100)
  for (var i = 0; i < 20; i++) {
    var meshMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.3, transparent: true })
    var object = new THREE.Mesh(geometry, meshMaterial)
    // var object = new THREE.Mesh(new THREE.SphereGeometry(20, 6, 20), new THREE.MeshBasicMaterial({color: 0x0000ff, wireframe: true}))

    // var geometry = new THREE.SphereGeometry(40, 32, 32)
    // var material = new THREE.MeshBasicMaterial({color: 0x000000})
    // var object = new THREE.Mesh(geometry, material)

    object.position.x = Math.random() * 1000 - 500
    object.position.y = Math.random() * 600 - 300
    object.position.z = Math.random() * 800 - 400

    object.castShadow = false
    object.receiveShadow = false

    scene.add(object)
    objects.push(object)
  }

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

console.log('Nice examples: https://stemkoski.github.io/Three.js/Mouse-Click.html')
