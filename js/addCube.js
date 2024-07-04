import * as THREE from "three";
import { guiParams } from "./gui";

export const transformPointsToSphere = (particles, positions, duration) => {
	const targetRadius = 1.5;
	const numParticles = positions.length / 3;

	const helperSphereGeometry = new THREE.SphereGeometry(targetRadius, 32, 32);
	const helperSpherePositions =
		helperSphereGeometry.attributes.position.array;

	let startTime = null;

	function animateTransform(timestamp) {
		if (!startTime) startTime = timestamp;
		const elapsed = timestamp - startTime;
		const progress = Math.min(elapsed / duration, 1);

		for (let i = 0; i < numParticles; i++) {
			const index = i * 3;
			const helperIndex =
				Math.floor((Math.random() * helperSpherePositions.length) / 3) *
				3;

			const helperPosition = new THREE.Vector3(
				helperSpherePositions[helperIndex] - 5,
				helperSpherePositions[helperIndex + 1] + 3,
				helperSpherePositions[helperIndex + 2] - 2
			);

			const currentPosition = new THREE.Vector3(
				positions[index],
				positions[index + 1],
				positions[index + 2]
			);

			const newPosition = new THREE.Vector3().lerpVectors(
				currentPosition,
				helperPosition,
				progress
			);

			positions[index] = newPosition.x;
			positions[index + 1] = newPosition.y;
			positions[index + 2] = newPosition.z;
		}

		particles.attributes.position.needsUpdate = true;

		if (progress < 1) {
			requestAnimationFrame(animateTransform);
		}
	}

	requestAnimationFrame(animateTransform);
};

export const transformPointsToCube = (
	particles,
	positions,
	startPositions,
	duration
) => {
	let startTime = null;

	function animateTransform(timestamp) {
		if (!startTime) startTime = timestamp;
		const elapsed = timestamp - startTime;
		const progress = Math.min(elapsed / duration, 1);

		for (let i = 0; i < positions.length; i += 3) {
			const start = new THREE.Vector3(
				positions[i],
				positions[i + 1],
				positions[i + 2]
			);
			const end = new THREE.Vector3(
				startPositions[i],
				startPositions[i + 1],
				startPositions[i + 2]
			);

			positions[i] = THREE.MathUtils.lerp(start.x, end.x, progress);
			positions[i + 1] = THREE.MathUtils.lerp(start.y, end.y, progress);
			positions[i + 2] = THREE.MathUtils.lerp(start.z, end.z, progress);
		}

		particles.attributes.position.needsUpdate = true;

		if (progress < 1) {
			requestAnimationFrame(animateTransform);
		}
	}

	requestAnimationFrame(animateTransform);
};

export const addCube = (scene) => {
	guiParams.addCubeAnimation();
	const cubeSize = 3;
	const numParticles = 1000;

	const particles = new THREE.BufferGeometry();
	const positions = new Float32Array(numParticles * 3);
	const startPositions = new Float32Array(numParticles * 3);

	for (let i = 0; i < numParticles; i++) {
		const x = Math.random() * cubeSize - cubeSize / 2 - 5;
		const y = Math.random() * cubeSize - cubeSize / 2 + 3;
		const z = Math.random() * cubeSize - cubeSize / 2 - 2;

		positions[i * 3] = x;
		positions[i * 3 + 1] = y;
		positions[i * 3 + 2] = z;

		startPositions[i * 3] = x;
		startPositions[i * 3 + 1] = y;
		startPositions[i * 3 + 2] = z;
	}

	particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));

	const textureLoader = new THREE.TextureLoader();
	const particleTexture = textureLoader.load("/assets/textures/heart.png");

	const particleMaterial = new THREE.PointsMaterial({
		size: 0.5,
		map: particleTexture,
		transparent: true,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
		color: 0x7393b3,
	});

	const particleSystem = new THREE.Points(particles, particleMaterial);

	scene.add(particleSystem);

	window.addEventListener("transform-to-sphere", () => {
		const duration = 1000;
		transformPointsToSphere(particles, positions, duration);
	});

	window.addEventListener("transform-to-cube", () => {
		const duration = 1000;
		transformPointsToCube(particles, positions, startPositions, duration);
	});
};
