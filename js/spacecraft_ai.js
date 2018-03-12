SPACECRAFT_AI = {};

{

SPACECRAFT_AI.update = (delta, scene) => {
  LEVEL.spaceCrafts.forEach((sc) => {
    if (sc != LEVEL.localSpaceCraft) {
      simulate(sc);
    }
  });
}

const states = {
  attack: 2,  // Attack nearest enemy by aiming and keeping in range.
  flee: 3,  // Move away from nearest enemy.
}

const MIN_STATE_CHANGE_INTERVAL = 5;
const simulate = (sc) => {
  const now = performance.now() / 1000;
  const nearest = nearestEnemy();

  if (sc.ai == undefined) {
    sc.ai = {
      state: states.flee,
      lastStateChange: now,
    }
  }

  // Update state, if possible.
  if (now > sc.ai.lastStateChange + MIN_STATE_CHANGE_INTERVAL) {
    sc.ai.lastStateChange = now;

    const dist = sc.position.distanceTo(nearest.position);
    if (dist > 200) {
      sc.ai.state = states.attack;
      console.log('attacking');
    } else {
      sc.ai.state = states.flee;
      console.log('fleeing');
    }
  }

  // Act based on state.
  if (sc.ai.state == states.attack) {
    sc.inputs = {};
    sc.inputs.thrust = isShipLookingTowards(sc, nearest);
    sc.inputs.thrustReverse = !sc.inputs.thrust;
  } else if (sc.ai.state == states.flee) {
    sc.inputs.thrust = true;
  }
}

const nearestEnemy = (sc) => {
  return LEVEL.localSpaceCraft;
};

const t0 = new THREE.Vector3();
const t1 = new THREE.Vector3();
const isShipLookingTowards = (ship, target) => {
  t0.copy(target.position).sub(ship.position);
  ship.worldFront(t1);
  const angle = t0.angleTo(t1);  // Angle between 0 and pi.
  return angle < Math.PI / 2;
};




}
