LEVEL = {};

{

LEVEL.localSpaceCraft = null;
LEVEL.spaceCrafts = [];
LEVEL.staticObjs = [];
LEVEL.teams = {
  local: 1,
  enemy: 2,
}

LEVEL.teamConfigs = [];
LEVEL.teamConfigs[LEVEL.teams.local] = {
  trailColor: 0xAAAAFF,
  photonColor: 0x88AAFF,
};
LEVEL.teamConfigs[LEVEL.teams.enemy] = {
  trailColor: 0xFF9999,
  photonColor: 0xFF9999,
};

LEVEL.clear = (scene) => {
  scene.remove(...LEVEL.spaceCrafts);
  LEVEL.localSpaceCraft = null;
  LEVEL.spaceCrafts = [];
}

LEVEL.loadLevelNum = (num, scene) => {
  LEVEL.clear(scene);
  levelSetupFuncs[num](scene);
  // TODO: FIX THIS
  window.setTimeout(() => {
    SOUNDFX.initLevel();
  }, 3000);
}

LEVEL.removeShip = (ship) => {
  const i = LEVEL.spaceCrafts.indexOf(ship);
  if (i > -1) { LEVEL.spaceCrafts.splice(i, 1); }
  MAIN.scene.remove(ship.line);
  MAIN.scene.remove(ship);
}

const createLocalSpaceCraft = (scName, scene) => {
  LEVEL.localSpaceCraft = SPACECRAFT.spawners[scName]();
  LEVEL.localSpaceCraft.team = LEVEL.teams.local;

  LEVEL.spaceCrafts.push(LEVEL.localSpaceCraft);
  scene.add(LEVEL.localSpaceCraft);
}

const createSpaceCraft = (scName, scene, team) => {
  newSc = SPACECRAFT.spawners[scName]();
  newSc.team = team || LEVEL.teams.enemy;

  LEVEL.spaceCrafts.push(newSc);
  scene.add(newSc);

  return newSc;
}

const levelSetupFuncs = [
  // Level 1.
  (scene) => {
    LEVEL.staticObjs = ASTEROIDS.populate(scene, 1001);
    createLocalSpaceCraft('dstar', scene);
    LEVEL.localSpaceCraft.position.y = -1000;

    let enemy;
    /*let enemy
    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.enemy);
    enemy.position.y = 200;
    enemy.position.x = 50;
    enemy.rotateZ(Math.PI);

    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.enemy);
    enemy.position.y = 100;
    enemy.position.x = -50;

    /// test
    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.enemy);
    enemy.position.y = 500;
    enemy.position.x = -50;

    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.local);
    enemy.position.y = -500;
    enemy.position.x = 0;
    enemy.position.z = 100;

    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.local);
    enemy.position.y = -500;
    enemy.position.x = -400;
    enemy.position.z = 150;

    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.local);
    enemy.position.y = -500;
    enemy.position.x = 400;
    enemy.position.z = -150;*/

    const interval = 100;
    for (let i = -4; i <= 4; i++) {
      if (i == 0) continue;
      enemy = createSpaceCraft('dstar', scene, LEVEL.teams.local);
      enemy.position.y = -1000;
      enemy.position.x = i * interval + 50;
      enemy.rotateZ(Math.PI * -.3);
    }
    for (let i = -5; i <= 5; i++) {
      enemy = createSpaceCraft('dstar', scene, LEVEL.teams.enemy);
      enemy.position.y = 1000;
      enemy.position.z = i * interval;
      enemy.rotateZ(Math.PI * 1.3);
    }
    /**/

  },
];



}
