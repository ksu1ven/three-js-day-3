import * as THREE from "three";

export const addSphere = (scene) => {
	const vertexShader = `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

	const fragmentShader = `
        uniform float time;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;
            vec3 color = vec3(0.5 + 0.5 * sin(time + uv.x * 10.0), 0.5 + 0.5 * sin(time + uv.y * 10.0), 0.5);
            gl_FragColor = vec4(color, 1.0);
        }
    `;

	const uniforms = {
		time: { value: 1.0 },
	};

	const shaderMaterial = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
	});

	const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);

	const sphere = new THREE.Mesh(sphereGeometry, shaderMaterial);
	sphere.position.set(4, 3, 0);
	scene.add(sphere);

	function animateSphere() {
		shaderMaterial.uniforms.time.value += 0.1;

		requestAnimationFrame(animateSphere);
	}

	animateSphere();
};
