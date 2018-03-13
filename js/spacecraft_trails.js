SPACECRAFT_TRAILS = {}

{

const TRAIL_LENGTH = 1000;


function getPosHistory(sc, ago) {
  let cursor = (sc.posHistoryCursor - ago) % TRAIL_LENGTH;
  cursor = (cursor + TRAIL_LENGTH) % TRAIL_LENGTH;
  return sc.posHistory[cursor];
}


let time = 0;
let lastUpdate = 0;
SPACECRAFT_TRAILS.update = (scene, delta) => {
  time += delta;

  if (time < lastUpdate + 0.001) {
    return;
  }
  lastUpdate = time;

  LEVEL.spaceCrafts.forEach((sc) => {
    // Initialize posHistory.
    if (sc.posHistory == undefined) {
      sc.posHistory = [];
      sc.posHistoryCursor = 0;
      for (let x = 0; x < TRAIL_LENGTH; x++) {
        sc.posHistory[x] = new THREE.Vector3();
      }
    }

    // Increment cursor and store new position.
    sc.posHistoryCursor = (sc.posHistoryCursor + 1) % TRAIL_LENGTH;
    const pos = sc.posHistory[sc.posHistoryCursor]

    sc.worldFront(pos);
    pos.multiplyScalar(-20).add(sc.position);

    const material = new THREE.LineBasicMaterial({
      color: LEVEL.teamConfigs[sc.team].trailColor || 0xFFFFFF,
      linewidth: 1000,
    });
    const geometry = new THREE.Geometry();
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      geometry.vertices.push(getPosHistory(sc, i));
    }
    const line = new THREE.Line(geometry, material);
    scene.remove(sc.line);
    scene.add(line);
    sc.line = line;


  });

}


}
