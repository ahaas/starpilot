PHYSICS = {}

{


const maxVelocity = 100;
const maxAngularVelocity = 100;
const velocityDecay = 5;
const angularVelocityDecay = 20;

const halfPi = Math.PI / 2;
const xAxis = new THREE.Vector3(0, 1, 0);
const tmpVector3 = new THREE.Vector3(0, 0, 0);
const tmpVector3_2 = new THREE.Vector3(0, 0, 0);

PHYSICS.update = (delta) => {
  if (LEVEL.spaceCrafts.length == 0) {
    return;
  }
  updateLocalVelocities(delta);
  updatePositions(delta);
};

const updateLocalVelocities = (delta) => {
  const obj = LEVEL.localSpaceCraft;
  decayVelocities(obj, delta);

  const scalar = delta * 1e5 / obj.mass;
  if (CONTROLS.keysPressed['w']) {
    obj.getWorldDirection(tmpVector3);
    // TODO: Clean up. Rotate x axis to get obj-local x axis, before
    // rotating world direction to fix it.
    tmpVector3_2.copy(xAxis).applyQuaternion(obj.quaternion);
    tmpVector3.applyAxisAngle(tmpVector3_2, halfPi);
    tmpVector3.normalize().multiplyScalar(scalar);
    obj.velocity.add(tmpVector3);
  }

  obj.velocity.clampLength(0, maxVelocity);
  obj.angularVelocity.clampLength(0, maxAngularVelocity);
}

const updatePositions = (delta) => {
  LEVEL.spaceCrafts.forEach((obj) => {
    // Don't modify velocity.
    tmpVector3.copy(obj.velocity).multiplyScalar(delta);
    obj.position.add(tmpVector3);

    if (obj == LEVEL.localSpaceCraft) {
      //CONTROLS.addToCamera(tmpVector3);
    }
  });
}

const decayVelocities = (obj, delta) => {
  const velocityDecayAmount = velocityDecay * delta;
  if (obj.velocity.length() < velocityDecayAmount) {
    obj.velocity.x = 0;
    obj.velocity.y = 0;
    obj.velocity.z = 0;
  } else {
    tmpVector3.copy(obj.velocity);
    tmpVector3.normalize().multiplyScalar(velocityDecayAmount);
    obj.velocity.sub(tmpVector3);
  }

  const angularVelocityDecayAmount = angularVelocityDecay * delta;
  if (obj.angularVelocity.length() < angularVelocityDecayAmount) {
    obj.angularVelocity.x = 0;
    obj.angularVelocity.y = 0;
    obj.angularVelocity.z = 0;
  } else {
    tmpVector3.copy(obj.angularVelocity);
    tmpVector3.normalize().multiplyScalar(angularVelocityDecayAmount);
    obj.angularVelocity.sub(tmpVector3);
  }
}

PHYSICS.initializeObject = (obj, {mass, moment}) => {
  obj.mass = mass;
  obj.moment = moment;
  obj.velocity = new THREE.Vector3(0, 0, 0);
  obj.angularVelocity = new THREE.Vector3(0, 0, 0);
};


}
