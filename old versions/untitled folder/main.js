import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
        const canvas = document.getElementById("c");
        const CanvasThreeJS = document.getElementById("THREEjs");

class ProjectTest {
    constructor(){
        this._Initialize();
    };


    _Initialize() {
        

        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha:true, preserveDrawingBuffer: true });
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(CanvasThreeJS.clientWidth, CanvasThreeJS.clientHeight); 

        CanvasThreeJS.appendChild(this.renderer.domElement);

        window.addEventListener('resize', () => {
            console.log("nnn")
            this._OnWindowResize();
        }, false);

        const fov = 54.4;
        const aspect = 1;
        const near = 1.0;
        const far = 1000.0;
        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(75, 20, 0);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(100, 100, -100);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = 0.01;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 1.0;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = 200;
        light.shadow.camera.right = -200;
        light.shadow.camera.top = 200;
        light.shadow.camera.bottom = -200;
        this._scene.add(light);

        light = new THREE.AmbientLight(0x404040);
        this._scene.add(light);

        const controls = new OrbitControls(this._camera, this.renderer.domElement);
        controls.target.set(0, 15, 0);
        controls.enableDamping = true;   //damping 
        controls.dampingFactor = 0.2;   //damping inertia
        controls.enableZoom = true;      //Zooming
        controls.minDistance = 40;
        controls.maxDistance = 50;
        controls.autoRotate = true;       // enable rotation
        controls.maxPolarAngle = Math.PI / 2; // Limit angle of visibility
        controls.update();

        // const loader = new THREE.CubeTextureLoader();
        // const texture = loader.load([
        //     './resources/posx.jpg',
        //     './resources/negx.jpg',
        //     './resources/posy.jpg',
        //     './resources/negy.jpg',
        //     './resources/posz.jpg',
        //     './resources/negz.jpg',
        // ]);
        // this._scene.background = texture;

        // const plane = new THREE.Mesh(
        //     new THREE.PlaneGeometry(100, 100, 10, 10),
        //     new THREE.MeshStandardMaterial({
        //         color: 0xFFFFFF,
        //       }));
        // plane.castShadow = false;
        // plane.receiveShadow = true;
        // plane.rotation.x = -Math.PI / 2;
        // this._scene.add(plane);
    
        // const box = new THREE.Mesh(
        //     new THREE.BoxGeometry(20, 20, 20),
        //     new THREE.MeshStandardMaterial({
        //         color: 0xFFFFFF,
        //     }));
        //   box.position.set(0, 10, 0);
        //   box.castShadow = true;
        //   box.receiveShadow = true;
        //   this._scene.add(box);
      

        // function resizeRendererToDisplaySize(renderer) {
        //     const canvas = renderer.domElement;
        //     const width = CanvasThreeJS.clientWidth;
        //     const height = CanvasThreeJS.clientHeight;
        //     const needResize = canvas.width !== width || canvas.height !== height;
        //     if (needResize) {
        //       renderer.setSize(width, height, false);
        //     }
        //     return needResize;
        //   }


        const elem = document.querySelector('#screenshot');
        elem.addEventListener('click', () => {
            var dataUrl = this.renderer.domElement.toDataURL("image/png");
            console.log(dataUrl);
        });

        

        this._LoadModel();
        this._RAF();
    };

    

    _LoadModel() {
        const loader = new GLTFLoader();
        loader.load('./resources/female.gltf', (gltf) => {
            
          gltf.scene.traverse(c => {
            c.scale.set(2.3, 2.3, 2.3)
            c.castShadow = true;
          });
          this._scene.add(gltf.scene);
        });
      }

      

    _OnWindowResize(){
        this._camera.updateProjectionMatrix();
        this.renderer.setSize(CanvasThreeJS.clientWidth, CanvasThreeJS.clientHeight);
    }

    _RAF(){
        requestAnimationFrame(() => {
            this.renderer.render(this._scene, this._camera);
            this._RAF();
        });
    }

}




let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new ProjectTest();
});