PROJECTILES = {}

{

projectiles = [];

const v0 = new THREE.Vector3();
const v1 = new THREE.Vector3();
PROJECTILES.add = (obj, length, origin, end, time, cb) {
  const dir = v0.copy(end).sub(origin).normalize();
  origin = origin.clone().add(
    dir.clone().multiplyScalar(length/2));
  end = end.clone().sub(
    dir.clone().multiplyScalar(length/2));

  obj.projectileData = {
    origin, end, time, dir, cb,
    distance: origin.distanceTo(end),
    start: performance.now() / 1000,
  }
  projectiles.push(obj);

  obj.position.copy(origin);
  MAIN.scene.add(obj);
}

PROJECTILES.update = () {
  const now = performance.now() / 1000;
  const toRemove = [];
  projectiles.forEach((pj) => {
    if (now > pj.start + pj.time) {
      MAIN.scene.removoe(pj);
      toRemove.push(pj);
      pj.cb();
    } else {
      v0.copy(origin);
      pj.position.copy(origin)
                 .add(pj.dir.multiplyScalar(
                     pj.distance * (now - pj.start) / pj.time));
    }
  });
  toRemove.forEach((pj) => { projectiles.remove(pj); });
}


}
