import "./style.css";

import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

import { init } from "./js/init";
import { addLight } from "./js/addLight";
import { addModel } from "./js/addModel";
import { addBackground } from "./js/addBackground";
import { addSphere } from "./js/addSphere";
import { addCube } from "./js/addCube";
import { addBoard } from "./js/addBoard";

const { sizes, camera, scene, canvas, renderer, controls, clock } = init();

let particlesData, particleSystem, specialLight, specialParticlePosition;

let mouseX = 0,
	mouseY = 0;

let previousMouseX = 0,
	previousMouseY = 0;

addLight(scene);
addModel(scene);
addBackground(scene, renderer);
addSphere(scene);
addCube(scene);
// addBoard(scene);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
	new THREE.Vector2(sizes.width, sizes.height),
	5,
	5,
	0.85
);
composer.addPass(bloomPass);

const animate = () => {
	requestAnimationFrame(animate);

	if (
		particleSystem &&
		particlesData &&
		specialLight &&
		specialParticlePosition
	) {
		const delta = clock.getDelta();
		const time = clock.getElapsedTime();

		const positions = particleSystem.geometry.attributes.position.array;

		const numParticlesToMove = 3;
		const lerpFactor = 0.1;

		for (let i = 0; i < positions.length / 3 - numParticlesToMove; i++) {
			const particleData = particlesData[i];

			const position = new THREE.Vector3(
				positions[3 * i],
				positions[3 * i + 1],
				positions[3 * i + 2]
			);

			position.add(
				particleData.velocity.clone().multiplyScalar(delta / 2)
			);

			const amplitude = 0.2;
			const frequency = 1;
			position.x += Math.sin(time * frequency + i) * amplitude;
			position.y += Math.cos(time * frequency + i) * amplitude;
			position.z += Math.sin(time * frequency + i) * amplitude;

			if (position.distanceTo(particleData.startPosition) > 10) {
				position.copy(particleData.startPosition);
			}

			positions[3 * i] = position.x;
			positions[3 * i + 1] = position.y;
			positions[3 * i + 2] = position.z;
		}

		let indexCounter = 0;

		for (
			let i = positions.length / 3 - numParticlesToMove;
			i < positions.length / 3;
			i++
		) {
			const index = i * 3;
			indexCounter += 1;

			const currentPosition = new THREE.Vector3(
				positions[index],
				positions[index + 1],
				positions[index + 2]
			);

			const mouseVector = new THREE.Vector3(mouseX, mouseY, -4);
			mouseVector.unproject(camera);

			const dir = mouseVector.sub(camera.position).normalize();
			const distance = -camera.position.z / dir.z;
			const newPosition = camera.position
				.clone()
				.add(dir.multiplyScalar(distance));

			const updatedPosition = new THREE.Vector3().lerpVectors(
				currentPosition,
				newPosition,
				lerpFactor
			);

			if (mouseX === previousMouseX && mouseY === previousMouseY) {
				const angle = time + indexCounter;
				const radius = 0.1;
				updatedPosition.x += Math.cos(angle) * radius;
				updatedPosition.y += Math.sin(angle) * radius;
				positions[index] = updatedPosition.x;
				positions[index + 1] = updatedPosition.y;
				positions[index + 2] = updatedPosition.z;
			} else {
				positions[index] = updatedPosition.x + indexCounter * 0.05;
				positions[index + 1] = updatedPosition.y + indexCounter * 0.05;
				positions[index + 2] = updatedPosition.z;
			}
		}

		particleSystem.geometry.attributes.position.needsUpdate = true;

		specialLight.position.copy(
			new THREE.Vector3(positions[0], positions[1], positions[2])
		);

		previousMouseX = mouseX;
		previousMouseY = mouseY;
	}

	camera.position.x += (mouseX - camera.position.x) * 0.5;
	camera.position.y += (mouseY - camera.position.y) * 0.5;
	camera.lookAt(scene.position);
	composer.render();
	controls.update();
	renderer.render(scene, camera);
};

animate();

window.addEventListener("resize", (e) => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	composer.setSize(sizes.width, sizes.height);
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.render(scene, camera);
});

window.addEventListener("dblclick", () => {
	if (!document.fullscreenElement) {
		canvas.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});

window.addEventListener("lights", (event) => {
	({ particleSystem, particlesData, specialLight, specialParticlePosition } =
		event.detail);
});
const onDocumentMouseMove = (event) => {
	mouseX = (event.clientX / window.innerWidth) * 2 - 1;
	mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
};

document.addEventListener("mousemove", onDocumentMouseMove, false);
