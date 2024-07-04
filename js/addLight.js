import * as THREE from "three";

export const addLight = (scene) => {
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);
};
