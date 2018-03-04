MAIN = {}

{

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(80, 1, 0.1, 20000);
const scene = new THREE.Scene();

camera.position.set(10, 10, 10);
camera.up.set(0, 0, 1);  // Set +z as up.
camera.position.z = 5

renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1)
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let prevTime = performance.now();
function render() {
  requestAnimationFrame(render);

  const time = performance.now();
  // Prevent large delta due to paused animation.
  const delta = Math.min((time - prevTime) / 1000, 0.1);
  prevTime = time;

  PHYSICS.update(delta);
  if (LEVEL.localSpaceCraft) {
    LEVEL.localSpaceCraft.add(camera);
  }

  renderer.render(scene, camera);
}
render();

const onResize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
window.addEventListener('resize', onResize, false);
onResize();

scene.add(new THREE.AxesHelper(100));


// Lights
const ambient = new THREE.AmbientLight(0x333333);
scene.add(ambient);

const directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(0, 3, 1);
scene.add(directionalLight);

// Loading manager
THREE.DefaultLoadingManager.onLoad = () => {
  scene.add(SKYBOX.construct());
  CONTROLS.setMode(CONTROLS.modes.ORBIT, camera, renderer);
  LEVEL.loadLevelNum(0, scene);
};

THREE.DefaultLoadingManager.onProgress = (url, numLoaded, numTotal) => {
  //console.log('Loading: ' + url + '\nLoaded ' + numLoaded + '/' + numTotal);
};



}
