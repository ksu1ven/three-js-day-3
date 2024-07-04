import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { createFireflies } from "./createFireflies";

export const addModel = async (scene) => {
	const loaderGLTF = new GLTFLoader();
	const loaderFBX = new FBXLoader();

	loaderGLTF.load(
		"/assets/models/DragonAttenuation.glb",
		function (gltf) {
			const model = gltf.scene;
			model.position.set(-2, -2, -5);

			if (model) {
				model.traverse((child) => {
					if (child.isMesh) {
						child.material.transparent = true;
						child.material.opacity = 0;
					}
				});
			}
			scene.add(model);
		},
		undefined,
		function (error) {
			return;
		}
	);
	loaderFBX.load(
		"/assets/models/table/chinese_tea_table_4k.fbx",
		(object) => {
			object.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
			const scale = 0.1;
			object.scale.set(scale, scale, scale);
			object.position.set(0, -5, -5);
			scene.add(object);
		},

		(error) => {
			return;
		}
	);

	loaderFBX.load(
		"/assets/models/book/book_encyclopedia_set_01_4k.fbx",
		(object) => {
			object.traverse((child) => {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
			});
			const scale = 0.1;
			object.scale.set(scale, scale, scale);
			object.position.set(-2.5, 0, -5);
			scene.add(object);

			createFireflies(scene, object.position);
		},

		(error) => {
			return;
		}
	);
};
