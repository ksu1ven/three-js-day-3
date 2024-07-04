import * as THREE from "three";

export const addBoard = (scene) => {
	const boardWidth = 10;
	const boardHeight = 6;

	const boardGeometry = new THREE.PlaneGeometry(boardWidth, boardHeight);
	const boardMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
	});

	const board = new THREE.Mesh(boardGeometry, boardMaterial);
	board.position.set(5, -3, 0);

	scene.add(board);
};
