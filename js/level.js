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

    let enemy
    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.enemy);
    enemy.position.y = 100;
    enemy.position.x = 50;

    enemy = createSpaceCraft('dstar', scene, LEVEL.teams.enemy);
    enemy.position.y = 100;
    enemy.position.x = -50;
  },
];



}
