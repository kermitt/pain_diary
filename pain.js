
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
  return y
}

function getZ (units_over) {
  let z = units_over * stride
  z -= side_half
  return z
}

function reset () {
  controls.reset()
  render()
}

function makeBobby () {
  populateBodyPartSphere(getX(3.2), getY(1), getZ(5), stride * 0.6, 16, 16, 'left_foot')
  populateBodyPartSphere(getX(3.5), getY(2), getZ(5), stride * 0.8, 16, 16, 'left_calf')
  populateBodyPartSphere(getX(4.0), getY(3), getZ(5), stride * 1, 16, 16, 'left_thigh')
  populateBodyPartSphere(getX(7.8), getY(1), getZ(6), stride * 0.6, 16, 16, 'right_foot')
  populateBodyPartSphere(getX(7.5), getY(2), getZ(6), stride * 0.8, 16, 16, 'right_calf')
  populateBodyPartSphere(getX(7.1), getY(3), getZ(6), stride * 1, 16, 16, 'right_thigh')
  populateBodyPartSphere(getX(5.3), getY(4.5), getZ(6), stride * 1.3, 16, 16, 'tummy')
  populateBodyPartSphere(getX(5.3), getY(6.5), getZ(6.3), stride * 1.2, 16, 16, 'chest')
  populateBodyPartSphere(getX(5.4), getY(8), getZ(6.7), stride * 0.8, 16, 16, 'head')
  populateBodyPartBox(getX(5), getY(5), getZ(5), 100, 100, 100, 'right_foot')

  populateBodyPartSphere(getX(3.6), getY(6.8), getZ(7), stride * 0.7, 16, 16, 'left_upperarm')
  populateBodyPartSphere(getX(3.0), getY(6.0), getZ(7.2), stride * 0.6, 16, 16, 'left_lowerarm')
  populateBodyPartSphere(getX(2.9), getY(5.0), getZ(7.3), stride * 0.4, 16, 16, 'left_hand')

  populateBodyPartSphere(getX(7.1), getY(6.8), getZ(6), stride * 0.7, 16, 16, 'right_upperarm')
  populateBodyPartSphere(getX(7.7), getY(6.0), getZ(5.9), stride * 0.6, 16, 16, 'left_lowerarm')
  populateBodyPartSphere(getX(7.8), getY(5.0), getZ(5.8), stride * 0.4, 16, 16, 'left_hand')

//  populateBodyPartBox(getX(1), getY(10), getZ(2), stride, stride, stride)
//  populateBodyPartBox(getX(6), getY(2), getZ(2), stride, stride, stride)
}

function populateBodyPartSphere (x, y, z, radius, widthSegments, heightSegments, bodyPart) {
  // var geometry = new THREE.SphereGeometry(100, 16, 16)

  /// OUTER
  var geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
  var meshMaterial = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.6, transparent: true })
  var object = new THREE.Mesh(geometry, meshMaterial)
  object.position.x = x// Math.random() * 1000 - 500
  object.position.y = y// Math.random() * 600 - 300
  object.position.z = z// Math.random() * 800 - 400

  object.castShadow = false
  object.receiveShadow = false
  object.name = ++next_object_id
  scene.add(object)
  // objects.push(object)
  /*
  /// INNER
  var geometry2 = new THREE.SphereGeometry((radius * 0.6), widthSegments, heightSegments)
  var meshMaterial2 = new THREE.LineBasicMaterial({ color: 0xff6633, opacity: 0.9, transparent: true })
  var object2 = new THREE.Mesh(geometry2, meshMaterial2)
  object2.position.x = x// + 40 // Math.random() * 1000 - 500
  object2.position.y = y// + 40 // Math.random() * 600 - 300
  object2.position.z = z// + 40 // Math.random() * 800 - 400

  object2.castShadow = false
  object2.receiveShadow = false
  object2.name = ++next_object_id
  scene.add(object2)
  objects.push(object2)
  */
}

function populateBodyPartBox (x, y, z, sideX, sideY, sideZ, bodyPart) {
  var geometry = new THREE.BoxGeometry(sideX, sideY, sideZ)
  var meshMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, opacity: 0.5, transparent: true })
  var object = new THREE.Mesh(geometry, meshMaterial)
  object.position.x = x
  object.position.y = y
  object.position.z = z
  object.castShadow = false
  object.receiveShadow = false
  object.name = ++next_object_id
  scene.add(object)
  // objects.push(object)
  /*
  // inner
  var geometry2 = new THREE.BoxGeometry(sideX * 0.5, sideY * 0.5, sideZ * 0.5)
  var meshMaterial2 = new THREE.LineBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true })
  var object2 = new THREE.Mesh(geometry2, meshMaterial2)
  object2.position.x = x + 5
  object2.position.y = y + 5
  object2.position.z = z + 5
  object2.castShadow = false
  object2.receiveShadow = false
  object2.name = ++next_object_id
  scene.add(object2)
  objects.push(object2)
  */
}
