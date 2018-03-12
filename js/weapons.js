WEAPONS = {}

{


WEAPONS.update = (delta, scene) => {

  const localSC = LEVEL.localSpaceCraft;

  if (CONTROLS.keysPressed['c']) {
    localSC.energy = Math.max(localSC.energy - delta, 0);
    console.log('firing');
  }


};

WEAPONS.initializeShip = (sc) => {
  sc.energy = 1;
};


}
