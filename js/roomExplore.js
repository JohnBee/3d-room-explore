import { OrbitControls } from "./OrbitalControls.js";
import { GLTFLoader } from './GLTFLoader.js';
import * as THREE from "./three.module.js";



window.onload = function(){
    const info = document.getElementById("info");
}

class RoomExplore {
	constructor() {
		this._init();
	}
	_init() {
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		window.addEventListener('resize', this._onWindowResize.bind(this), false)
		window.addEventListener('mousedown', this._onMouseDown);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();

		this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 2000);
		this.camera.position.set(6, 31, 72);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this._loadRoomModel();
		this._loadLighting();
		this._renderLoop();
	}
	_loadLighting() {
		const ambientLight = new THREE.AmbientLight(0xffffff); // full bright light
		this.scene.add(ambientLight);
	}
	_onMouseDown(event){
		info.style.display = 'none';
	}
	
	_loadRoomModel() {
		new GLTFLoader()
			.setPath('models/')
			.load('pcroom.gltf', (gltf => {
				const room = gltf.scene;
				const degrees = 225 * Math.PI / 180;
				const scale = 10;
				room.scale.set(scale, scale, scale);

				room.position.set(10, scale * -4, 0);
				room.rotation.set(0, degrees, 0);
				this.scene.add(room);
			}).bind(this),
				this._onProgress,
				function (error) {
					console.log("Error occured loading model: " + error);
				});

	}
	_onProgress(xhr) {
		if (xhr.lengthComputable) {
			const percentComplete = xhr.loaded / xhr.total * 100;
			console.log(Math.round(percentComplete, 2) + '% downloaded');
		}

	}
	_onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this._render();
	}
	_renderLoop() {
		requestAnimationFrame(this._render.bind(this));
	}
	_render(time) {
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
		requestAnimationFrame(this._render.bind(this));
	}

}


let ThreeApp = null;

window.addEventListener('DOMContentLoaded', () => {
	ThreeApp = new RoomExplore();
	console.log("loaded Scene.");
});
