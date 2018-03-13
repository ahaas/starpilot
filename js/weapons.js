WEAPONS = {}

{

const CANNON_DELAY = 0.25;
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
      SOUNDFX.fireShip(ship);
      ship.nextFire = now + CANNON_DELAY;
    }
  });
};

const PHOTON_LENGTH = 200;
const PHOTON_SPEED = 2000;
const photonGeometry = new THREE.CylinderBufferGeometry(1, 1, PHOTON_LENGTH);

const teamPhotonMats = [];
for (let teamName in LEVEL.teams) {
  const teamIndex = LEVEL.teams[teamName];
  const teamConfig = LEVEL.teamConfigs[teamIndex];
  console.log(teamName, teamIndex, teamConfig);
  teamPhotonMats[teamIndex] = new THREE.MeshBasicMaterial({
    color: teamConfig.photonColor,
  });
};

const raycaster = new THREE.Raycaster();
const v0 = new THREE.Vector3();
const fireCannon = (ship, scene) => {

  // Do a forward trace.
  const origin = new THREE.Vector3().copy(ship.position);
  const end = new THREE.Vector3();
  raycaster.set(ship.position, ship.worldFront());

  let hitShip = null;
  let intersection = null;
  LEVEL.spaceCrafts.forEach((targetShip) => {
    if (targetShip == ship) {
      return;
    }
    const intersections = raycaster.intersectObject(targetShip.actual);
    if (intersections.length > 0) {
      intersection = intersections[0];
      hitShip = targetShip;
    }
  });

  if (hitShip == null) {
    ship.worldFront(end).multiplyScalar(MISS_TRAVEL).add(ship.position);
  } else {
    end.copy(intersection.point);
  }

  // Draw a laser beam.
  const photonMaterial = teamPhotonMats[ship.team];
  const photon = new THREE.Mesh(photonGeometry, photonMaterial);
  photon.rotateX(Math.PI/2);
  photon.applyMatrix(ship.matrix);

  const dist = v0.copy(origin).distanceTo(end);
  PROJECTILES.add(photon, PHOTON_LENGTH, origin, end, dist/PHOTON_SPEED,
      () => {
        if (hitShip) {
          hitShip.health -= 13.5/2;
          if (hitShip.health <= 0) {
            VFX.explode(hitShip.position, 50, 4, 0xFFFFFF, 0xFFFFFF);
            LEVEL.removeShip(hitShip);
            MAIN.scene.remove(hitShip);
          } else {
            VFX.explode(hitShip.position, 15, 0.25, 0xAAAAFF, 0xFFFFFF);
          }
          console.log("HIT! Remaining health: ", hitShip.health);
        }
      }
  );
};

WEAPONS.initializeShip = (sc) => {
  sc.energy = 100;  // TODO: prevent spam firing
  sc.health = 100;
  sc.nextFire = 0;
};


}
