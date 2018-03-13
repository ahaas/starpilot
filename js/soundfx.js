SOUNDFX = {}

{

let photonBuffer;
let photonBufferDistant;

const audioLoader = new THREE.AudioLoader();
audioLoader.load('sounds/photon.mp3', (buffer) => {
  console.log('PHOTON LOADED');
  photonBuffer = buffer;
  //SOUNDFX.initLevel(); // TODO: fix loading manager behavior?
});
audioLoader.load('sounds/photon_distant.mp3', (buffer) => {
  console.log('PHOTON LOADED');
  photonBufferDistant = buffer;
  //SOUNDFX.initLevel(); // TODO: fix loading manager behavior?
});

SOUNDFX.initLevel = () => {
  console.log('SOUNDFX INIT LEVEL', photonBuffer, photonBufferDistant);
  LEVEL.spaceCrafts.forEach((ship) => {
    const sound = new THREE.PositionalAudio(MAIN.listener);
    if (ship == LEVEL.localSpaceCraft) {
      sound.setBuffer(photonBuffer);
    } else {
      sound.setBuffer(photonBufferDistant);
      sound.setRolloffFactor(0.3);
    }
    sound.setRefDistance(20);
    ship.add(sound);
    ship.photonSound = sound;
  });
}

SOUNDFX.fireShip = (ship) => {
  if (ship.photonSound.isPlaying) ship.photonSound.stop();
  ship.photonSound.play();
}



}
