SKYBOX = {};

{

const loader = new THREE.TextureLoader();
const imagePrefix = "img/skybox_";
const directions  = ["LF", "RT", "FR", "BK", "UP", "DN"];
const imageSuffix = ".jpg";
const skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 ); 

const materialArray = [];
for (let i = 0; i < 6; i++) {
  loader.load(imagePrefix + directions[i] + imageSuffix, (texture) => {
    materialArray.push( new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide
    }));
  });
}

SKYBOX.construct = () => {
  const skyBox = new THREE.Mesh(skyGeometry, materialArray);
  return skyBox;
}



}
