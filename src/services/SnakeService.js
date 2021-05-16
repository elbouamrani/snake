/* eslint-disable no-unused-vars */
const SnakeService = {
	generateGrid: (height, width) => {
		const grid = [];
		for (let jndex = 0; jndex < height; jndex++) {
			const row = [];
			for (let index = 0; index < width; index++) {
				row.push(0);
			}
			grid.push(row);
		}
		return grid;
	},
	generateFood(matrix) {
		//TODO: valida if postion is empty
		const grid = matrix.slice();

		const position = [
			Math.floor(Math.random() * grid.length),
			Math.floor(Math.random() * grid[0].length),
		];

		grid[position[0]][position[1]] = 3;

		return grid;
	},
	moveHead(grid, position, direction, body) {
		const x = position[1] + direction[1];
		const y = position[0] + direction[0];

		//validate grid boundries
		if (y >= grid.length || y < 0 || x >= grid[0].length || x < 0) {
			// console.log("wall collision");
			return null;
		}

		//check for self collision by comparing snake body with current head position
		const collision = body.find((section) => {
			return section.x == x && section.y == y;
		});

		if (collision) {
			// console.log("self collision");
			return null;
		}

		//restrict food supply to one,
		//edit to merge grid with generated food
		if (grid[y][x] == 3) {
			// console.log("food collision");
			const matrix = SnakeService.generateFood(grid);

			//reset cell to empty
			matrix[y][x] = 0;

			const newBody = JSON.parse(JSON.stringify(body));

			newBody.push({
				x: position[1],
				y: position[0],
			});

			// console.log(
			// 	JSON.stringify({ position, last: newBody.length && newBody[0] })
			// );

			return {
				status: "gain",
				position: [y, x],
				grid: matrix,
				body: newBody,
			};
		}

		// console.log("simple movement");
		const newBody = [...body];

		newBody.unshift({
			x: position[1],
			y: position[0],
		});

		newBody.pop();

		return { status: "move", position: [y, x], body: newBody };
	},
};

export default SnakeService;
