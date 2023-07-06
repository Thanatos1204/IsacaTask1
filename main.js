import { PointLightHelper } from 'three';
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { gsap } from 'gsap';
import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TweenMax } from 'gsap/gsap-core';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#background'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);

camera.position.setZ(50);

renderer.render(scene,camera);

const loader = new TTFLoader();

loader.load('https://api.fontsource.org/v1/fonts/lora/latin-600-italic.ttf', (fontData)=>{
  const font = new Font(fontData);

  const textgeometry = new TextGeometry('FrontEnd Developer', {
    font: font,
    size: 10,
    height: 10,
    curveSegments: 32,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.5,
    bevelOffset: 0,
    bevelSegments: 8
  });

  const textmaterial = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0xFF8ED6),
    specular: new THREE.Color("rgb(140,70,140)"),
    shininess: 10,
    shading: THREE.FlatShading,
    transparent: 1,
    opacity: 1
  });

  const textmesh = new THREE.Mesh(textgeometry,textmaterial);
  textmesh.position.set(0,0,0);

  const boundingbox = new THREE.Box3();
  textmesh.geometry.computeBoundingBox();
  const vec = new THREE.Vector3(0,0,0);
  boundingbox.copy(textmesh.geometry.boundingBox).getCenter(vec);
  textmesh.geometry.translate(-vec.x,-vec.y,-vec.z);
  
  
  //textgeometry.translate(0,0,0);
  
 
    
    gsap.fromTo(textmesh.rotation, {
      z: -Math.PI/6,},{
      z: Math.PI/6,
      duration: 5,
      ease: "power1.inOut",
      repeat: -1,
      yoyo: true
    });
    
  
  scene.add(textmesh);
  
});



const material = new THREE.MeshPhongMaterial({
  color: new THREE.Color(0xFF0080),
  specular: new THREE.Color(0x99FFFF),
  shininess: 10,
  shading: THREE.FlatShading,
  transparent: 1,
  opacity: 1
});




// Magenta-Pink Pointlight
var L1 = new THREE.PointLight(0xB887ED, 1.5);
L1.position.z = 450;
L1.position.y = 200;
L1.position.x = 200;
scene.add(L1);
// Dark Purple Pointlight
var L2 = new THREE.PointLight(0x436CE8, 1.5);
L2.position.z = 45;
L2.position.y = -15;
L2.position.x = -20;
scene.add(L2);
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.55);
const gridHelper = new THREE.GridHelper(window.innerWidth,window.innerHeight);

const dirLight = new THREE.DirectionalLight(0xFFFFF,3);
//spotLight.position.set(50,100,0);

//const slh = new THREE.SpotLightHelper(spotLight);
const plh1 = new THREE.PointLightHelper(L1);
const plh2 = new THREE.PointLightHelper(L2);

scene.add(dirLight);

const controls = new OrbitControls(camera, renderer.domElement);


//adding randomly aligned donuts


const torusgeometry = new THREE.TorusGeometry(0.6,0.358,13,40);
const boxgeometry = new THREE.BoxGeometry(1,1,1);
const myAxis = new THREE.Vector3(0,0,1);
function addDonuts(){
  
  const donut = new THREE.Mesh(torusgeometry,material);

  const cube = new THREE.Mesh(boxgeometry,material);

  const [x,y,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(150));
  donut.position.set(x,y,z);

  const [p,q,r] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(150));
  cube.position.set(p,q,r);

  const [a,b,c] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(720));
  donut.rotateX(THREE.MathUtils.degToRad(a));
  donut.rotateY(THREE.MathUtils.degToRad(b));
  donut.rotateZ(THREE.MathUtils.degToRad(c));
  
  const [d,e,f] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(720));
  cube.rotateX(THREE.MathUtils.degToRad(d));
  cube.rotateY(THREE.MathUtils.degToRad(e));
  cube.rotateZ(THREE.MathUtils.degToRad(f));  
  scene.add(donut,cube);
}

Array(500).fill().forEach(addDonuts);

// Move camera function
const container = document.getElementById('background');
const initialCameraPosition = { x: camera.position.x, y: camera.position.y };
function onMouseMove(event) {
  const mouseX = (event.clientX / container.clientWidth) * 2 - 1;
  const mouseY = -((event.clientY / container.clientHeight) * 2 - 1);
  
  camera.position.x = initialCameraPosition.x + mouseX * 100;
  camera.position.y = initialCameraPosition.y + mouseY * 100;  
  
  renderer.render(scene, camera);
}
container.addEventListener('mousemove', onMouseMove);


//TO ROTATE ENTIRE SCENE

gsap.fromTo(scene.rotation, {
  z: Math.PI/5,},{
  z: -Math.PI/5,
  duration: 10,
  ease: "power1.inOut",
  repeat: -1,
  yoyo: true
});





function animate(){
  requestAnimationFrame(animate);
 

  controls.update();
  renderer.render(scene,camera);
}

animate();
