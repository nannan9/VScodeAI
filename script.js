import * as THREE from './node_modules/three/build/three.module.js';
import { STLLoader } from './node_modules/three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from './node_modules/three/examples/jsm/loaders/PLYLoader.js';
import { OBJLoader } from './node_modules/three/examples/jsm/loaders/OBJLoader.js';

let scene, camera, renderer, model;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    const viewer = document.getElementById('viewer');
    renderer.setSize(viewer.clientWidth, viewer.clientHeight);
    viewer.appendChild(renderer.domElement);

    camera.position.z = 5;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (model) model.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function loadModel(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const contents = event.target.result;
        let loader;
        const extension = file.name.split('.').pop().toLowerCase();
        switch (extension) {
            case 'stl':
                loader = new STLLoader();
                const geometrySTL = loader.parse(contents);
                model = new THREE.Mesh(geometrySTL, new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
                scene.add(model);
                break;
            case 'ply':
                loader = new PLYLoader();
                const geometryPLY = loader.parse(contents);
                model = new THREE.Mesh(geometryPLY, new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
                scene.add(model);
                break;
            case 'obj':
                loader = new OBJLoader();
                const object = loader.parse(contents);
                model = object;
                scene.add(model);
                break;
            default:
                alert('Unsupported file format');
                return;
        }
    };
    reader.readAsArrayBuffer(file);
}

function processModel() {
    if (!model) return;
    // 1. 去除模型上的零散面片
    // 2. 补全模型上除边缘之外的空洞
    // 3. 处理模型边缘
    // 4. 按照边缘外扩2mm，按照当前视线方向拉伸5mm
    // 5. 对边缘拉伸后的模型进行封底，封底后的底座与视线方向垂直
    // 6. 将封底后的模型替换原始模型
    // 以上处理步骤需要具体的算法实现，这里仅提供框架
}

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    loadModel(file);
});

document.getElementById('previewButton').addEventListener('click', function() {
    processModel();
});

init();
