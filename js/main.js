MAIN = {}

{

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
});
const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 1000 * 1000 * 2);
const scene = new THREE.Scene();
const stats = new Stats();
MAIN.listener = new THREE.AudioListener();
camera.add(MAIN.listener);

MAIN.scene = scene;

const skybox = SKYBOX.construct();

camera.position.set(0, -50, 18);
camera.up.set(0, 0, 1);  // Set +z as up.

renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.body.appendChild(stats.dom);

//

let prevTime = performance.now();  // Can be replaced with THREE.Clock
function render() {
  requestAnimationFrame(render);

  const time = performance.now();
  // Prevent large delta due to paused animation.
  const delta = Math.min((time - prevTime) / 1000, 0.1);
  prevTime = time;

  PHYSICS.update(delta);
  SPACECRAFT_TRAILS.update(scene, delta);
  SPACECRAFT_AI.update(delta, scene);
  PROJECTILES.update();

  if (LEVEL.localSpaceCraft) {
    WEAPONS.update(delta, scene);
    LEVEL.localSpaceCraft.add(camera);
    VFX.update();
    camera.getWorldPosition(skybox.position);
  }

  renderer.render(scene, camera);
  stats.update();
}
render();

const onResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', onResize, false);
onResize();

//

scene.add(new THREE.AxesHelper(100));

// Lights
const ambient = new THREE.AmbientLight(0x333333);
scene.add(ambient);

const directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 3, 1);
scene.add(directionalLight);

const dL = new THREE.DirectionalLight(0x555555);
dL.position.set(3, 0, 1);
scene.add(dL);

const hemiLight = new THREE.HemisphereLight(0x555555, 0x111111, 0.5);
scene.add(hemiLight);

// Loading manager
THREE.DefaultLoadingManager.onLoad = () => {
  scene.add(skybox);
  CONTROLS.setMode(CONTROLS.modes.ORBIT, camera, renderer);
  LEVEL.loadLevelNum(0, scene);
};

THREE.DefaultLoadingManager.onProgress = (url, numLoaded, numTotal) => {
  console.log('Loading: ' + url + '\nLoaded ' + numLoaded + '/' + numTotal);
};



}
