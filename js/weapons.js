WEAPONS = {}

{

const CANNON_DELAY = 0.5;
const MISS_TRAVEL = 2000;  // distance of missed shots

WEAPONS.update = (delta, scene) => {
  const localSC = LEVEL.localSpaceCraft;
  const now = performance.now() / 1000;

  localSC.inputs.fire = CONTROLS.keysPressed['c'];

  LEVEL.spaceCrafts.forEach((ship) => {
    if (ship.nextFire != 0 && now > ship.nextFire) {
      ship.nextFire = 0;
      fireCannon(ship, scene);
    }
    if (ship.inputs.fire && ship.nextFire == 0) {
      ship.nextFire = now + CANNON_DELAY;
    }
  });
};

const PHOTON_LENGTH = 40;
const PHOTON_SPEED = 1000;
const photonGeometry = new THREE.CylinderBufferGeometry(5, 5, PHOTON_LENGTH);
const photonMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });

const raycaster = new THREE.Raycaster();
const v0 = new THREE.Vector3();
const fireCannon = (ship, scene) => {
  // Do a forward trace.
  const origin = new THREE.Vector3().copy(ship.position);
  const end = new THREE.Vector3();
  raycaster.set(ship.position, ship.worldFront());

  let hitShip = null;
  LEVEL.spaceCrafts.forEach((targetShip) => {
    if (targetShip == ship) {
      return;
    }
    const intersections = raycaster.intersectObject(targetShip.actual).length
    if (intersections.length > 0) {
      end.copy(intersections[0].point);
      hitShip = targetShip;
    }
  });

  if (hitShip == null) {
    ship.worldFront(end).multiplyScalar(MISS_TRAVEL).add(ship.position);
  }

  // Draw a laser beam.
  const photon = new THREE.Mesh(photonGeometry, photonMaterial);
  photon.rotateX(Math.PI/2);
  photon.applyMatrix4(ship.matrix);

  const dist = v0.copy(origin).distanceTo(end);
  PROJECTILES.add(photon, PHOTON_LENGTH, origin, end, dist/PHOTON_SPEED,
      () => {
        hitShip.health -= 13.5;
        console.log("HIT! Remaining health: ", hitShip.health);
      }
  );
};

WEAPONS.initializeShip = (sc) => {
  sc.energy = 100;  // TODO: prevent spam firing
  sc.health = 100;
  sc.nextFire = 0;
};


}