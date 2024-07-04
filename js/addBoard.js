import * as THREE from "three";

export const addBoard = (scene) => {
	const boardWidth = 10;
	const boardHeight = 6;

	// Создаем геометрию и материал для доски
	const boardGeometry = new THREE.PlaneGeometry(boardWidth, boardHeight);
	const boardMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
	});

	// Создаем Mesh и устанавливаем его позицию
	const board = new THREE.Mesh(boardGeometry, boardMaterial);
	board.position.set(5, -3, 0); // Позиция в правом нижнем углу сцены

	// Добавляем доску в сцену
	scene.add(board);
};
