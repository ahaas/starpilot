PHYSICS = {}

{

const maxvel = 100;
const maxAngularvel = 0.9;
const velDecaySpeed = 5;
const angVelDecaySpeed = 20;

const halfPi = Math.PI / 2;
const tmpVector3 = new THREE.Vector3(0, 0, 0);

PHYSICS.update = (delta) => {
  if (LEVEL.spaceCrafts.length == 0) {
    return;
  }
  //updateLocalVelocities(delta);
  updateLocalInput();
  LEVEL.spaceCrafts.forEach((ship) => {
    updateShipVelocities(ship, delta);
  });
  updatePositions(delta);
  updateAngles(delta);
};

const keyToInputMap = {
  shift: 'thrust',
  space: 'thrustReverse',
  d: 'rollRight',
  a: 'rollLeft',
  s: 'pitchUp',
  w: 'pitchDown',
  q: 'yawLeft',
  e: 'yawRight',
}

const updateLocalInput = () => {
  const localShip = LEVEL.localSpaceCraft;
  localShip.inputs = localShip.inputs || {};
  for (let key in keyToInputMap) {
    localShip.inputs[keyToInputMap[key]] = CONTROLS.keysPressed[key];
  }
};

// Update velocities based on ship.inputs
const updateShipVelocities = (ship, delta) => {
  let hasThrustInput = false;
  ship.worldFront(tmpVector3);
  const scalar = delta * 8 / ship.mass;
  if (ship.inputs.thrust) {
    hasThrustInput = true;
    tmpVector3.normalize().multiplyScalar(scalar * ship.thrust);
    ship.vel.add(tmpVector3);
  }
  if (ship.inputs.thrustReverse) {
    hasThrustInput = true;
    tmpVector3.normalize().multiplyScalar(scalar * ship.reverseThrust);
    ship.vel.sub(tmpVector3);
  }
  if (!hasThrustInput) {
    decayVector3(ship.vel, delta, velDecaySpeed);
  }

  applyAngInput(ship, SPACECRAFT.localFrontAxis, delta,
                ship.inputs.rollRight, ship.inputs.rollLeft);
  applyAngInput(ship, SPACECRAFT.localRightAxis, delta,
                ship.inputs.pitchUp, ship.inputs.pitchDown);
  applyAngInput(ship, SPACECRAFT.localUpAxis, delta,
                ship.inputs.yawLeft, ship.inputs.yawRight);

  ship.vel.clampLength(0, maxvel);
  ship.angVel.clampLength(0, maxAngularvel);  // should be `clamp`?
};

const applyAngInput = (obj, axis, delta, inputIncr, inputDecr) => {
  const stableBoost = 2;
  let angScalar = delta * obj.angularThrust * 1e-2 / obj.moment[axis];
  if (inputDecr && !inputIncr) {
    if (obj.angVel[axis] > 0) {
      angScalar *= stableBoost;
    }
    obj.angVel[axis] -= angScalar;
  } else if (inputIncr && !inputDecr) {
    if (obj.angVel[axis] < 0) {
      angScalar *= stableBoost;
    }
    obj.angVel[axis] += angScalar;
  } else {
    if (obj.angVel[axis] > 0) {
      obj.angVel[axis] = Math.max(0, obj.angVel[axis] - angScalar);
    } else if (obj.angVel[axis] < 0) {
      obj.angVel[axis] = Math.min(0, obj.angVel[axis] + angScalar);
    }
  }
}

const updatePositions = (delta) => {
  LEVEL.spaceCrafts.forEach((obj) => {
    // Don't modify vel.
    tmpVector3.copy(obj.vel).multiplyScalar(delta);
    obj.position.add(tmpVector3);
  });
}

const updateAngles = (delta) => {
  LEVEL.spaceCrafts.forEach((obj) => {
    tmpVector3.copy(obj.angVel).multiplyScalar(delta);
    obj.rotateX(tmpVector3.x);
    obj.rotateY(tmpVector3.y);
    obj.rotateZ(tmpVector3.z);
  });
}

const decayVector3 = (vec3, delta, decaySpeed) => {
  const amount = decaySpeed * delta;
  if (vec3.length() < amount) {
    vec3.x = vec3.y = vec3.z = 0;
  } else {
    tmpVector3.copy(vec3);
    tmpVector3.normalize().multiplyScalar(amount);
    vec3.sub(tmpVector3);
  }
}

PHYSICS.initializeObject = (obj, scSpec) => {
  obj = Object.assign(obj, scSpec);

  obj.vel = new THREE.Vector3(0, 0, 0);
  obj.angVel = new THREE.Vector3(0, 0, 0);
  obj.isThrusting = false;
  obj.inputs = {};
};


}
