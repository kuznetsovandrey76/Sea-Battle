let getElement = function (className) {
	return document.querySelector(className);
}; 

let getRandom = function(n) {
	return Math.floor(Math.random() * n);
};

// FIELDS

// Создаем двумерный массив: rows - строки, columns - столбцы
let create2dArray = function (rows, columns) {
   let arr = new Array(rows);
   for (let i = 0; i < rows; i++) {
       arr[i] = new Array(columns).fill(0);
   }
   return arr;
}

let matrix = create2dArray(10, 10); 

// Массив координат
let Matrix =  {
	matrix: matrix,
	show: function() {
		console.log(this.matrix);
	},
	change: function(x, y, type) {
		// где type
		// 0 - пустая клетка
		// 1 - палуба корабля
		// 2 - клетка, отмеченная игроком / запрет
		// 3 - промах
		// 4 - попадание
		this.matrix[y-1][x-1] = type; // !
	}
};

let fillField = function(x, y, arr) {
	return 0;	
}
let field = getElement('.field');
let dot = getElement('.dot');


field.addEventListener('click', (e) => {
	// 26px расстояние до внутреннего поля в playfield.png
	if (e.offsetX - 26 > 2 && 
		e.offsetX - 26 < 300 &&
		e.offsetY - 26 > 2 &&
		e.offsetY - 26 < 300) {
		dot.classList.remove('hidden')
		// Показывает координаты выстрела 
		console.log(`x: ${Math.ceil((e.offsetX - 26) / 30)}, y: ${Math.ceil((e.offsetY - 26) / 30)}`);		
		dot.style.left = 26 + 30 * Math.floor((e.offsetX - 26) / 30) + 'px';
		dot.style.top = 26 + 30 * Math.floor((e.offsetY - 26) / 30) + 'px';
		
		// Изменяем матрицу координат
		let coordX = Math.ceil((e.offsetX - 26) / 30);
		let coordY = Math.ceil((e.offsetY - 26) / 30);
		Matrix.change(coordX, coordY, 2);
		Matrix.show();
	}
});


// SHIPS

let Ships = function (player, obj) {
		// на каком поле создаётся данный корабль
		this.player 	= player;
		// уникальное имя корабля
		this.shipname 	= obj.shipname;
		//количество палуб
		this.decks		= obj.decks;
		// координата X первой палубы
		this.x0			= obj.x;
	 	// координата Y первой палубы
		this.y0			= obj.y;
		// направлении расположения палуб
		this.kx			= obj.kx;
		this.ky 		= obj.ky;
		// счётчик попаданий
		this.hits 		= 0;
		// массив с координатами палуб корабля
		this.matrix		= [];
	}



let randomShip = function(type) {
	// type - вид корабля
	// 1 - singledeck
	// 2 - doubledeck
	// 3 - tripledeck
	// 4 - fourdeck
	this.type = type;
	// 1 - right / горизонталь, 0 - bottom / вертикаль  
	let directions = ['right', 'bottom'];

	// Рандомное направление  
	this.direction = getRandom(2);
	// console.log(`type: ${this.type + 1}`, `direction: ${directions[this.direction]}`);
	// Проверка, если корабль расположен по горизонтали
	if (this.direction == 1) {
		// Координата Х первой палубы
		this.x = getRandom(10) + 1;
		// Сдвигаю поиск на единицу (до 11) для удобного отображения
		while (this.x + this.type > 11) {
			// console.log('ERR x,', `type: ${this.type+1}`, `coordX: ${this.x+1}`)
			this.x = getRandom(10) + 1; 
		}
		this.y = getRandom(10) + 1;
		// console.log('ok x,', `type: ${this.type+1}`, `coordX: ${this.x+1}`)		
	}
	// Проверка, если корабль расположен по вертикали
	if (this.direction == 0) {
		this.y = getRandom(10) + 1;
		while (this.y + this.type > 11) {
			// console.log('ERR y,', `type: ${this.type+1}`, `coordY: ${this.y+1}`)
			this.y = getRandom(10) + 1; 
		}
		this.x = getRandom(10) + 1;
		// console.log('ok y,', `type: ${this.type+1}`, `coordY: ${this.x+1}`)	
	}

	// console.log(`ship: ${this.type+1}, coordX: ${this.x+1}, coordY: ${this.y+1}, direction: ${directions[this.direction]}`);
	return {
		// Тип корабля / количество палуб
		// type: this.typeype,
		// Координата Х первой палубы
		coordX: this.x,
		// Координата У первой палубы
		coordY: this.y,
		// Напраление, 1 - right / горизонталь, 0 - bottom / вертикаль  
		direction: this.direction
	}
};


let checkLocationShip = function(matrix, coordX, coordY, direction, type, func) {
			// let temp = func(type);	
				for(let i = 0; i < type; i++) {
					if (direction == 1) {
						// проставляем корабль
						matrix[coordY - 1][coordX - 1 + i] = 1;
					} else {
						matrix[coordY - 1 + i][coordX - 1] = 1;
					}
				}  

			// 1. Берем левую верхнюю координату
			// 2. Рамка сверху
			// Если не 0, с [coordy - 1][coordX - 1] по [coordy - 1][coordX + type + 1]
				//  для direction == 1
				if (direction == 1) {					
						// Отмечаем Левый Верхний угол
						if (coordX - 1 > 0 && coordY - 1 > 0) matrix[coordY - 2][coordX - 2] = 2;
						// Отмечаем Левый Нижний угол
						if (coordX - 1 > 0 && coordY + 1 < 11) matrix[coordY][coordX - 2] = 2;
						// Отмечаем Правый Нижний угол
						if (coordX + type + 1 < 11 && coordY - 1 > 0) matrix[coordY - 2][coordX + type - 1] = 2;
						// Отмечаем Правый Верхний угол
						if (coordX + type + 1 < 11 && coordY + 1 < 11) matrix[coordY][coordX + type - 1] = 2;
						// Отмечаем Рамка сверху
						if (coordY - 1 > 0) {
							for(let i = 0; i < type; i++) {
								matrix[coordY - 2][coordX - 1 + i] = 2;
							}
						}
						// Отмечаем Рамка снизу
						if (coordY + 1 < 11) {
							for(let i = 0; i < type; i++) {
								matrix[coordY][coordX - 1 + i] = 2;
							}
						}
						// Отмечаем Рамка слева
						if (coordX - 1 > 0) matrix[coordY - 1][coordX - 2] = 2;
						// Отмечаем Рамка справа
						if (coordX + type + 1 < 11) matrix[coordY - 1][coordX + type - 1] = 2;
				}
				if (direction == 0) {					
						// Отмечаем Левый Верхний угол
						if (coordX - 1 > 0 && coordY - 1 > 0) matrix[coordY - 2][coordX - 2] = 2;
						// Отмечаем Левый Нижний угол
						if (coordX - 1 > 0 && coordY + type < 11) matrix[coordY + type - 1][coordX - 2] = 2;
						// Отмечаем Правый Нижний угол
						if (coordX + 1 < 11 && coordY + type < 11) matrix[coordY + type - 1][coordX] = 2;
						// Отмечаем Правый Верхний угол
						// if (coordX + type + 1 < 11 && coordY + 1 < 11) matrix[coordY][coordX + type - 1] = 2;
						// Отмечаем Рамка сверху
						if (coordY - 1 > 0) {
							for(let i = 0; i < type; i++) {
								// matrix[coordY - 2][coordX - 1 + i] = 2;
							}
						}
						// Отмечаем Рамка снизу
						if (coordY + 1 < 11) {
							for(let i = 0; i < type; i++) {
								// matrix[coordY][coordX - 1 + i] = 2;
							}
						}
						// Отмечаем Рамка слева
						// if (coordX - 1 > 0) matrix[coordY - 1][coordX - 2] = 2;
						// Отмечаем Рамка справа
						// if (coordX + type + 1 < 11) matrix[coordY - 1][coordX + type - 1] = 2;
				}

			// добавляем границы вокруг корабля
			// 3. Рамка снизу
			// Если не 0, с [coordy + 1][coordX - 1] по [coordy - 1][coordX + type + 1]
			// 4. Рамка сбоку
			// Если не 0, с [coordy][coordX - 1] и [coordy][coordX + type + 1]
	console.log(matrix);	
}

// test
checkLocationShip(Matrix.matrix, 4, 8, 0, 3, randomShip);



// Записать координаты в матрицу
let addShip = function(matrix, func, type) {
	// console.log(matrix);	
	let temp = func(type);	
	console.log(temp);
	for(let i = 0; i < type; i++) {
		if (temp.direction == 1) {
			// проставляем корабль
			matrix[temp.coordY - 1][temp.coordX - 1 + i] = 1;
		} else {
			matrix[temp.coordY - 1 + i][temp.coordX - 1] = 1;
		}
	}  
	console.log(matrix);	
};

// addShip(Matrix.matrix, randomShip, 4);