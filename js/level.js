LEVEL = {}

{

LEVEL.localSpaceCraft = null;
LEVEL.spaceCrafts = [];
LEVEL.teams = {
  local: 1,
  enemy: 2,
}

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

  LEVEL.spaceCrafts.push(LEVEL.localSpaceCraft);
  scene.add(localSpaceCraft);
}

const levelSetupFuncs = [
  // Level 1.
  (scene) => {
    ASTEROIDS.populate(scene, 1001);
    createLocalSpaceCraft('dstar', scene);
  },
];



}
