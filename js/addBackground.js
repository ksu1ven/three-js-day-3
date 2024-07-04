import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { PMREMGenerator, UnsignedByteType } from "three";

export const addBackground = (scene, renderer) => {
	const loader = new EXRLoader();

	loader.load(
		"/assets/textures/castle_zavelstein_cellar_4k.exr",
		(texture) => {
			const pmremGenerator = new PMREMGenerator(renderer);
			pmremGenerator.compileEquirectangularShader();
			const exrCubeRenderTarget =
				pmremGenerator.fromEquirectangular(texture);
			const exrBackground = exrCubeRenderTarget.texture;
			scene.background = exrBackground;
			scene.environment = exrBackground;
			texture.dispose();
			pmremGenerator.dispose();
		},
		undefined,
		(error) => {
			console.error("An error happened", error);
		}
	);
};
