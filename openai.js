let getElement = function (className) {
	return document.querySelector(className);
}; 

let getRandom = function(n) {
	return Math.floor(Math.random() * n);
};

// MATRIX

// Создаем двумерный массив: rows - строки, columns - столбцы
let create2dArray = function (rows, columns) {
   let arr = new Array(rows);
   for (let i = 0; i < rows; i++) {
       arr[i] = new Array(columns).fill(0);
   }
   return arr;
}

// Матрицы для координат
let matrixUser = create2dArray(10, 10); 
let matrixPC = create2dArray(10, 10); 



// SHIPS 
let userShips = [];
let pcShips = [];

// Создаю корабль с корректными координатами
let randomShip = function(type) {
	// type - число, количество палуб
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
		type: this.type,
		// Координата Х первой палубы
		coordX: this.x,
		// Координата У первой палубы
		coordY: this.y,
		// Напраление, 1 - right / горизонталь, 0 - bottom / вертикаль  
		direction: this.direction
	}
};

let check = function(ship, matrix) {
	this.ship = ship;
	// Проверка не заняты ли координаты другим кораблем или его обводкой (1 или 2)
	for(let i = 0; i < this.ship.type; i++) {
		if (this.ship.direction == 1) {
			if (this.ship.coordX == 10) {
				// исправить баг, расположение корабля в 10 столбце 
				return false;
			}
			if (matrix[this.ship.coordY - 1][this.ship.coordX - 1 + i]) {
				return false;
			} 
		} 
		if (this.ship.direction == 0) {
		if (this.ship.coordX == 10) {
			// исправить баг, расположение корабля в 10 столбце 
			return false;
		}
		if (matrix[this.ship.coordY - 1 + i][this.ship.coordX - 1]) {
			return false;
		} 
		}
	}
	return ship;
};

let addShip = function(ship, matrix) {
	// Прорисовка корабля и контура вокруг него
	for(let i = 0; i < ship.type; i++) {
		if (ship.direction == 1) {
			// Отмечаем координаты корабля
			matrix[ship.coordY - 1][ship.coordX - 1 + i] = 1;
		} else {
			matrix[ship.coordY - 1 + i][ship.coordX - 1] = 1;
		}
	}  
	// Отмечаем / 2 / область вокруг корабля 
	// Если корабль расположен горизонтально
	if (ship.direction == 1) {					
		// Отмечаем Левый Верхний угол
		if (ship.coordX - 1 > 0 && ship.coordY - 1 > 0) matrix[ship.coordY - 2][ship.coordX - 2] = 2;
		// Отмечаем Левый Нижний угол
		if (ship.coordX - 1 > 0 && ship.coordY + 1 < 11) matrix[ship.coordY][ship.coordX - 2] = 2;
		// Отмечаем Правый Нижний угол
		if (ship.coordX + ship.type + 1 < 11 && ship.coordY - 1 > 0) matrix[ship.coordY - 2][ship.coordX + ship.type - 1] = 2;
		// Отмечаем Правый Верхний угол
		if (ship.coordX + ship.type + 1 < 11 && ship.coordY + 1 < 11) matrix[ship.coordY][ship.coordX + ship.type - 1] = 2;
		// Отмечаем Рамка сверху
		if (ship.coordY - 1 > 0) {
			for(let i = 0; i < ship.type; i++) {
				matrix[ship.coordY - 2][ship.coordX - 1 + i] = 2;
			}
		}
		// Отмечаем Рамка снизу
		if (ship.coordY + 1 < 11) {
			for(let i = 0; i < ship.type; i++) {
				matrix[ship.coordY][ship.coordX - 1 + i] = 2;
			}
		}
		// Отмечаем Рамка слева
		if (ship.coordX - 1 > 0) matrix[ship.coordY - 1][ship.coordX - 2] = 2;
		// Отмечаем Рамка справа
		if (ship.coordX + ship.type + 1 < 11) matrix[ship.coordY - 1][ship.coordX + ship.type - 1] = 2;
	}
	 
	// Если корабль расположен вертикально
	if (ship.direction == 0) {					
		// Отмечаем Левый Верхний угол
		if (ship.coordX - 1 > 0 && ship.coordY - 1 > 0) matrix[ship.coordY - 2][ship.coordX - 2] = 2;
		// Отмечаем Левый Нижний угол
		if (ship.coordX - 1 > 0 && ship.coordY + ship.type < 11) matrix[ship.coordY + ship.type - 1][ship.coordX - 2] = 2;
		// Отмечаем Правый Нижний угол
		if (ship.coordX + 1 < 11 && ship.coordY + ship.type < 11) matrix[ship.coordY + ship.type - 1][ship.coordX] = 2;
		// Отмечаем Правый Верхний угол
		if (ship.coordX + 1 < 11 && ship.coordY - 1 > 0) matrix[ship.coordY - 2][ship.coordX] = 2;
		// Отмечаем Рамка сверху
		if (ship.coordY - 1 > 0) matrix[ship.coordY - 2][ship.coordX - 1] = 2; 
		// Отмечаем Рамка снизу
		if (ship.coordY + ship.type < 11) matrix[ship.coordY + ship.type - 1][ship.coordX - 1] = 2;
		// Отмечаем Рамка слева
		if (ship.coordX - 1 > 0) {
			for(let i = 0; i < ship.type; i++) {
				matrix[ship.coordY - 1 + i][ship.coordX - 2] = 2;	
			}
		}
		// Отмечаем Рамка справа
		if (ship.coordX + 1 < 11) {
			for(let i = 0; i < ship.type; i++) {
				matrix[ship.coordY - 1 + i][ship.coordX] = 2;	
			}
		}

	}
};

// Создаем корабль
let createShip = function(func, type) {
	let ship = func(type); 
	return ship;
};


let addAllShips = function(matrix, whoseShips) {
	// Тип корабля и его количестов
	let type = {
		singledeck : 4,
		doubledeck : 3,
		tripledeck : 2,
		fourdeck : 1
	};

	let arr = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

	for(let i = 0; i < arr.length; i++ ) {
	
		// 1. Создаю рандомный корабль
		let ship = check(createShip(randomShip, arr[i]), matrix);

		// 2. Проверка, свободно ли место для размещения
		while (!ship) {
			ship = check(createShip(randomShip, arr[i]), matrix);
		}

		// Информация о корабле
		// console.log(ship);

		// Добавление в массив, координат кораблей, для последующей прорисовки
		whoseShips.push(ship);

	 	// 3. Когда проверка пройдена, добавление коробля в матрицу вместе с обводкой
		addShip(ship, matrix);	
	} 


};

// Формирование поля с рандомными кораблями
addAllShips(matrixUser, userShips);
addAllShips(matrixPC, pcShips);



// Прорисовка кораблей
let drawShips = function(arr, user) {
	for (var i = 0; i < arr.length; i++) {

		let coordX = arr[i].coordX * 30 - 5; 
		let coordY = arr[i].coordY * 30 - 5;
		let width = arr[i].direction ? arr[i].type * 30 : 30;
		let height = arr[i].direction ? 30 : arr[i].type * 30;

		// Добавляем корабль на поле
		let field = document.querySelector(user);
		let div = document.createElement('div');
		// Скрываю корабли при добавлении на поле user'a
		user == '.field-user' ? div.classList.add('ship', 'hidden') : div.classList.add('ship');
		div.style.width = width + 'px';
		div.style.height = height + 'px';
		div.style.left = coordX + 'px';
		div.style.top = coordY + 'px';
		div.style.border = '2px solid purple';
		field.appendChild(div); 
	}
}

drawShips(userShips, '.field-user');
drawShips(pcShips, '.field-pc');


// SHOT

let field = getElement('.field');

field.addEventListener('click', (e) => {
	// 26px расстояние до внутреннего поля в playfield.png
	if (e.offsetX - 26 > 2 && 
		e.offsetX - 26 < 300 &&
		e.offsetY - 26 > 2 &&
		e.offsetY - 26 < 300) {

		// Показывает координаты выстрела 
		// console.log(`x: ${Math.ceil((e.offsetX - 26) / 30)}, y: ${Math.ceil((e.offsetY - 26) / 30)}`);		
		let coordX = Math.ceil((e.offsetX - 26) / 30);
		let coordY = Math.ceil((e.offsetY - 26) / 30);

		// Проверка куда произведен выстрел
		// 0 - мимо
		// 1 - попал
		// 2 - мимо / обводка корабля
		if (matrixUser[coordY - 1][coordX - 1] == 1) {
			let field = document.querySelector('.field-user');
			let div = document.createElement('div');
			div.classList.add('knock');
			div.style.left = 26 + 30 * Math.floor((e.offsetX - 26) / 30) + 'px';
			div.style.top = 26 + 30 * Math.floor((e.offsetY - 26) / 30) + 'px';
			field.appendChild(div); 
			
		} 
		if (matrixUser[coordY - 1][coordX - 1] == 0 || matrixUser[coordY - 1][coordX - 1] == 2) {
			let field = document.querySelector('.field-user');
			let div = document.createElement('div');
			div.classList.add('dot');
			div.style.left = 26 + 30 * Math.floor((e.offsetX - 26) / 30) + 'px';
			div.style.top = 26 + 30 * Math.floor((e.offsetY - 26) / 30) + 'px';
			field.appendChild(div); 
		}
	}

});
