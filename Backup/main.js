import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/postprocessing/ShaderPass.js';

import { LuminosityShader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader } from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/shaders/SobelOperatorShader.js';

import { FXAAShader } from "https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/shaders/FXAAShader.js";

import { CustomOutlinePass } from "./CustomOutlinePass.js";


const canvas = document.getElementById("c");
const CanvasThreeJS = document.getElementById("THREEjs");
const renderedImg = document.getElementsByClassName("rendered-img")[0];

const models = ["female1.gltf", "female2.gltf","female13.gltf", "female14.gltf", "female15.gltf", "female16.gltf", "female19.gltf"];

const params = {
    enable: true
};
// let model = Math.floor(Math.random() * (models.length - 0) + 0);

let model = 0;

let currentModel;

console.log(model)

let light = new THREE.DirectionalLight();

const nextBtn = document.querySelector('#next');
const previousBtn = document.querySelector('#previous');

let buttonDelay = false;

const msg = document.getElementById("msg");
const overlay = document.getElementById("overlay");

canvas.onpointerdown = function(){
    msg.style.display = "none";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0)";
    overlay.style.visibility = "hidden";
}

let composer, effectSobel;

class ProjectTest {
    constructor(){
        this.Initialize();
    };


    Initialize() {
        

        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha:true, preserveDrawingBuffer: true });
        this.renderer.setSize(3000, 3000);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setPixelRatio(window.devicePixelRatio * 1.5);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(CanvasThreeJS.clientWidth, CanvasThreeJS.clientHeight); 

        CanvasThreeJS.appendChild(this.renderer.domElement);

        

        const fov = 54.4;
        const aspect = 1;
        const near = 1.0;
        const far = 1000.0;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 20, 75);

        this.scene = new THREE.Scene();
        
        // Shows 3D axes, comment out in production
        const axesHelper = new THREE.AxesHelper(20)
        this.scene.add(axesHelper)
        
        light.intensity = 0.85;

        this.scene.add(light);
  

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.target.set(0, 15, 0);
        controls.enableDamping = true;   //damping 
        controls.dampingFactor = 0.2;   //damping inertia
        controls.enableZoom = true;      //Zooming
        controls.minDistance = 40;
        controls.maxDistance = 50;
        controls.screenSpacePanning = false;
        controls.autoRotate = true;       // enable rotation
        controls.maxPolarAngle = Math.PI / 2; // Limit angle of visibility
        controls.saveState();
        controls.update();


        // postprocessing
        function postProcessingSobel(renderer, scene, camera){

        composer = new EffectComposer( renderer );
        const renderPass = new RenderPass( scene, camera );
        composer.addPass( renderPass );

        // color to grayscale conversion

        const effectGrayScale = new ShaderPass( LuminosityShader );
        composer.addPass( effectGrayScale );

        // Sobel operator
            effectSobel = new ShaderPass( SobelOperatorShader );
            effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
            effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
            composer.addPass( effectSobel );
        }

         postProcessingSobel(this.renderer, this.scene, this.camera);

            window.addEventListener('resize', () => {
                console.log("nnn")
                this.OnWindowResize();
            }, false);

            const elem = document.querySelector('#screenshot');
            elem.addEventListener('click', () => {
                var dataUrl = this.renderer.domElement.toDataURL("image/png");
                console.log(dataUrl);
                const image = new Image();
                image.src = dataUrl;
                renderedImg.innerHTML = "";
                renderedImg.appendChild(image);
            });


        
            nextBtn.addEventListener('click', () => {
                if(buttonDelay === false){
                    this.scene.remove(currentModel)
                    if(model < models.length - 1){
                        model++
                    }else{
                        model = 0;
                    }
                    console.log(model)
                    controls.reset();
                    this.LoadModel();
                    buttonDelay = true;
                    setTimeout(function() {
                        buttonDelay = false;
                    }, 500);
                }
            });

            previousBtn.addEventListener('click', () => {
                if(buttonDelay === false){
                    this.scene.remove(currentModel)
                    if(model > 0){
                        model--
                    }else{
                        model = models.length - 1;
                    }
                    console.log(model)
                    controls.reset();
                    this.LoadModel();
                    buttonDelay = true;
                    setTimeout(function() {
                        buttonDelay = false;
                    }, 500);
                }
            });
        
        
        this.LoadModel();
        
        this.RAF();
    };

    

    LoadModel() {
        const loader = new GLTFLoader();
        loader.load(`./resources/${models[model]}`, (gltf) => {
            
            

          gltf.scene.traverse(c => {
            c.scale.set(5, 5, 5)
            c.castShadow = true;
          });
          currentModel = gltf.scene;
          this.scene.add(gltf.scene);
          console.log(gltf.scene)
        });
      }

      

    OnWindowResize(){
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(CanvasThreeJS.clientWidth, CanvasThreeJS.clientHeight);

        composer.setSize( window.innerWidth, window.innerHeight );

        effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
        effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
    }



    RAF(){
        requestAnimationFrame(() => {
            light.position.copy(this.camera.position);
            this.renderer.render(this.scene, this.camera);
            if ( params.enable === true ) {

                composer.render();

            } else {

                renderer.render( scene, camera );

            }
            this.RAF();
        });
    }

}




let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new ProjectTest();
});