import GUI from "lil-gui";

export const gui = new GUI();

class GuiParams {
	constructor() {
		this.cubeAnimation = false;

		this.fieldsObject = {
			cubeAnimation: false,
		};
	}

	addCubeAnimation() {
		gui.add(this.fieldsObject, "cubeAnimation")
			.name("Cube to Sphere")
			.onChange((value) => {
				this.modelAnimation = value;

				if (value)
					window.dispatchEvent(
						new CustomEvent("transform-to-sphere")
					);
				else window.dispatchEvent(new CustomEvent("transform-to-cube"));
			});
	}
}

export const guiParams = new GuiParams();
