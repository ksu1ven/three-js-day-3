import * as THREE from "three";

export const createFireflies = (scene, bookPosition) => {
	const fireflyCount = 30;
	const particles = new THREE.BufferGeometry();
	const positions = [];
	const colors = [];
	const velocities = [];
	let particlesData = [];
	let particleSystem;
	let specialParticlePosition = [];

	const radius = 10.0;

	for (let i = 0; i < fireflyCount; i++) {
		let x, y, z;
		do {
			x = bookPosition.x + (Math.random() - 0.5) * 2 * radius;
			y = bookPosition.y + (Math.random() - 0.5) * 2 * radius;
			z = bookPosition.z + (Math.random() - 0.5) * 2 * radius;
			if (i === 0) {
				colors.push(0.6, 0, 1);

				specialParticlePosition.push(x, y, z);
			} else {
				colors.push(1, 1, 1);
			}
		} while (
			Math.sqrt(
				(x - bookPosition.x) ** 2 +
					(y - bookPosition.y) ** 2 +
					(z - bookPosition.z) ** 2
			) > radius
		);

		positions.push(x, y, z);

		velocities.push(
			Math.random() * 0.02 - 0.01,
			Math.random() * 0.02 - 0.01,
			Math.random() * 0.02 - 0.01
		);

		particlesData.push({
			velocity: new THREE.Vector3(
				velocities[3 * i],
				velocities[3 * i + 1],
				velocities[3 * i + 2]
			),
			startPosition: new THREE.Vector3(x, y, z),
		});
	}

	particles.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(positions, 3)
	);

	particles.setAttribute(
		"color",
		new THREE.Float32BufferAttribute(colors, 3)
	);

	const textureLoader = new THREE.TextureLoader();
	const starTexture = textureLoader.load("/assets/textures/star.png");

	const particleMaterial = new THREE.PointsMaterial({
		size: 1,
		map: starTexture,
		transparent: true,
		opacity: 1.0,
		blending: THREE.AdditiveBlending,
		depthWrite: false,
		vertexColors: true,
	});

	particleSystem = new THREE.Points(particles, particleMaterial);

	scene.add(particleSystem);

	const specialLight = new THREE.PointLight(0xff00ff, 100, 5);
	scene.add(specialLight);

	window.dispatchEvent(
		new CustomEvent("lights", {
			detail: {
				particleSystem,
				particlesData,
				specialParticlePosition,
				specialLight,
			},
		})
	);
};
