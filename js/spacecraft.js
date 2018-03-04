SPACECRAFT = {};

{

// Load all spaceship models and create spawner funcs.
SPACECRAFT.spawners = {};

const scSpecs = [
  {
    name: 'dstar',
    url: 'models/dstar_threejs/dstar.json',
    rotX: 1.57,
    mass: 10000,
    moment: 10000,
  },
]

const loader = new THREE.JSONLoader();
scSpecs.forEach((scSpec) => {
  loader.load(scSpec.url, function(geo, mats) {
    SPACECRAFT.spawners[scSpec.name] = () => {
      const obj = new THREE.Mesh(geo, mats[0]);
      if (scSpec.rotX) {
        obj.rotation.x = scSpec.rotX;
      }

      // Wrapper obj is unrotated.
      const wrapperObj = new THREE.Object3D();
      wrapperObj.add(obj);
      PHYSICS.initializeObject(wrapperObj, scSpec);
      return wrapperObj;
    };
  });
});



}
