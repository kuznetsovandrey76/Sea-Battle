// 'use strict';
// !!! 


// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

// Получить элемент 
let getElement = function (className) {
	return document.querySelector(className);
}; 

// Получить случайное число
let getRandom = function(n) {
	return Math.floor(Math.random() * n);
};

// Флаг - чей ход
let yourMove = false;

// Если при первоначальном выборе, говорю что хожу первым
// изменяет флаг 
getElement('.popup__choose-you').addEventListener('click', () => {
	yourMove = true;	
});



// MATRIX

// Создать двумерный массив: 
// rows - строки, columns - столбцы
let create2dArray = function (rows, columns) {
   let arr = new Array(rows);
   for (let i = 0; i < rows; i++) {
       arr[i] = new Array(columns).fill(0);
   }
   return arr;
}

// Матрицы для координат
// matrixUser - поле по которому стреляет User
let matrixUser = create2dArray(10, 10); 
let matrixPC = create2dArray(10, 10); 



// SHIPS 
// userShips - корабли по которым стреляет User
let userShips = [];
let pcShips = [];

// Создать корабль 
// Проверяет, не пересекают ли координаты корабля границу поля 
let randomShip = function(type) {
	// где type - число, количество палуб корабля
	// 1 - singledeck
	// 2 - doubledeck
	// 3 - tripledeck
	// 4 - fourdeck
	this.type = type;

	// Расположение корабля
	// 1 - right / горизонталь, 0 - bottom / вертикаль  
	// let directions = ['right', 'bottom'];
	this.direction = getRandom(2);

	// !!! Проверка повторяется, можно создать функцию
	// Проверка, если корабль расположен по горизонтали
	if (this.direction == 1) {
		// Координата Х первой палубы
		this.x = getRandom(10) + 1;
		// Сдвигаю поиск на единицу (до 11) для удобного отображения
		while (this.x + this.type > 11) {
			this.x = getRandom(10) + 1; 
		}
		// Если Х удовлетворяет условию, создаем случайный У
		this.y = getRandom(10) + 1;
	}

	// Проверка, если корабль расположен по вертикали
	if (this.direction == 0) {
		this.y = getRandom(10) + 1;
		while (this.y + this.type > 11) {
			this.y = getRandom(10) + 1; 
		}
		this.x = getRandom(10) + 1;
	}

	return {
		// Тип корабля / количество палуб
		type: this.type,
		// Координата Х первой палубы
		coordX: this.x,
		// Координата У первой палубы
		coordY: this.y,
		// Напраление, 1 - горизонталь, 0 - вертикально  
		direction: this.direction
	}
};

// Проверка координат
// Не занято ли данное место другим кораблем или его обводкой
// !!! Проблема с 10 столбцом
let check = function(ship, matrix) {
	this.ship = ship;

	for(let i = 0; i < this.ship.type; i++) {
		if (this.ship.direction == 1) {
			if (this.ship.coordX == 10) {
				// !!!
				return false;
			}
			if (matrix[this.ship.coordY - 1][this.ship.coordX - 1 + i]) {
				return false;
			} 
		} 
		if (this.ship.direction == 0) {
		if (this.ship.coordX == 10) {
			// !!!
			return false;
		}

		if (matrix[this.ship.coordY - 1 + i][this.ship.coordX - 1]) {
			return false;
		} 
		}
	}
	return ship;
};

// Прорисовка корабля и контура вокруг него
// ship - добавляемый корабль
// matrix - в чью матрицу добавляется корабль
let addShip = function(ship, matrix) {
	for(let i = 0; i < ship.type; i++) {
		if (ship.direction == 1) {
			// Отмечаем координаты корабля - 1
			matrix[ship.coordY - 1][ship.coordX - 1 + i] = 1;
		} else {
			matrix[ship.coordY - 1 + i][ship.coordX - 1] = 1;
		}
	}  
	// Отмечаем область вокруг корабля - 2 
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
		// Отмечаем Рамку сверху
		if (ship.coordY - 1 > 0) {
			for(let i = 0; i < ship.type; i++) {
				matrix[ship.coordY - 2][ship.coordX - 1 + i] = 2;
			}
		}
		// Отмечаем Рамку снизу
		if (ship.coordY + 1 < 11) {
			for(let i = 0; i < ship.type; i++) {
				matrix[ship.coordY][ship.coordX - 1 + i] = 2;
			}
		}
		// Отмечаем Рамку слева
		if (ship.coordX - 1 > 0) matrix[ship.coordY - 1][ship.coordX - 2] = 2;
		// Отмечаем Рамку справа
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
		// Отмечаем Рамку сверху
		if (ship.coordY - 1 > 0) matrix[ship.coordY - 2][ship.coordX - 1] = 2; 
		// Отмечаем Рамку снизу
		if (ship.coordY + ship.type < 11) matrix[ship.coordY + ship.type - 1][ship.coordX - 1] = 2;
		// Отмечаем Рамку слева
		if (ship.coordX - 1 > 0) {
			for(let i = 0; i < ship.type; i++) {
				matrix[ship.coordY - 1 + i][ship.coordX - 2] = 2;	
			}
		}
		// Отмечаем Рамку справа
		if (ship.coordX + 1 < 11) {
			for(let i = 0; i < ship.type; i++) {
				matrix[ship.coordY - 1 + i][ship.coordX] = 2;	
			}
		}

	}
};

// Создаем один корабль
// func - функция создания корабля
// type - тип данного корабля
let createShip = function(func, type) {
	let ship = func(type); 
	return ship;
};

// Создаем все 10 кораблей
// matrix - в чью матрицу добавляется корабль
// !!! whoseShips - чей корабль, User или PC
let addAllShips = function(matrix, whoseShips) {
	// Порядок расстоновки кораблей
	// Начать с четырехпалубного, закончить однопалубными 
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

// Заполнение матриц рандомными кораблями
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
		div.style.border = '3px solid #5d0efb';
		field.appendChild(div); 
	}
}

drawShips(userShips, '.field-user');
drawShips(pcShips, '.field-pc');


// INFO

// Вывод инофрмации о ходе игры
// msg - передаем часть сообщения
let info = function(msg) {
	getElement('.info').textContent = msg;
}

let msgInfo = [
	// Сообщение когда я начинаю первый
	'Погнали. Твой ход',
];






// SHOT

let field = getElement('.field');

// Количество оставшихся живых кораблей
let userAndPCShips = {
	user: {
		singledeck : 4,
		doubledeck : 3,
		tripledeck : 2,
		fourdeck : 1,
		total: 10
	}, 
	pc: {
		singledeck : 4,
		doubledeck : 3,
		tripledeck : 2,
		fourdeck : 1,
		total: 10
	} 
};


// Действия при нажатии User'a левой кнопки по игровому полю 
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

		// Координаты выстрела в виде строки, для взаимодействия с coordArr
		// console.log('' + coordX + coordY);

		// Проверка куда произведен выстрел
		// 0 - мимо
		// 1 - попал
		// 2 - мимо / обводка корабля

		// Действия при ПОПАДАНИИ по кораблю 
		if (matrixUser[coordY - 1][coordX - 1] == 1) {
			let field = document.querySelector('.field-user');
			let div = document.createElement('div');

			// Прорисовываем попадание крестом
			div.classList.add('knock');
			div.style.left = 26 + 30 * Math.floor((e.offsetX - 26) / 30) + 'px';
			div.style.top = 26 + 30 * Math.floor((e.offsetY - 26) / 30) + 'px';
			field.appendChild(div); 

			info('Есть пробитие ');

			// При попадании, находим в какой тип корабля попал,
			// изменяем данные в coordArr
			for(let i = 0; i < userShips.length; i++) {
					if ((userShips[i].coordArr).indexOf('' + coordX + coordY) != -1) {

						// Заменяю координату палубы в которую попали на 0
						userShips[i].coordArr[(userShips[i].coordArr).indexOf('' + coordX + coordY)] = 0; 
						
						// Перевожу массив с координатами корабля в строку и сравниваю с 0
						if (!(parseInt((userShips[i].coordArr).join('')))) {
							// Обратит внимание userAndPCShips и userShips разные массивы
							// !!! Разобраться с именами
							info('Убил! Продолжай в том же духе')
							updateNumberOfShips(userAndPCShips, 'user', userShips[i].type);	
							userAndPCShips.user.total -= 1;					
						} 
				} 			
			}			
		} 


		// Действия при ПРОМАХЕ 
		if (matrixUser[coordY - 1][coordX - 1] == 0 || matrixUser[coordY - 1][coordX - 1] == 2) {
			let field = document.querySelector('.field-user');
			let div = document.createElement('div');

			// Прорисовываем промах точкой
			div.classList.add('dot');
			div.style.left = 26 + 30 * Math.floor((e.offsetX - 26) / 30) + 'px';
			div.style.top = 26 + 30 * Math.floor((e.offsetY - 26) / 30) + 'px';
			field.appendChild(div); 

			// Передать ход PC
			info('Ход PC');
			game('pc');	
		}
	}
	
	if (!userAndPCShips.user.total) {
		// Блокирую свое поле
		// Вывод сообщения о победе
		let field = document.querySelector('.battlefield');
		let div = document.createElement('div');
		div.classList.add('locked');
		div.classList.add('locked-user');
		field.appendChild(div); 
		info('Yahoo! Вы победили');
	}

});

// Действия при нажатии User'a правой кнопки по игровому полю 
field.addEventListener('contextmenu', (e) => {
	// Убираем значение по умолчанию
	e.preventDefault();
	
	// Убираем ранее добавленный shade
	if (e.target.classList.value == 'shade') {
		e.target.classList.add('hidden');
	}

	if (e.offsetX - 26 > 2 && 
	e.offsetX - 26 < 300 &&
	e.offsetY - 26 > 2 &&
	e.offsetY - 26 < 300) {

		let coordX = Math.ceil((e.offsetX - 26) / 30);
		let coordY = Math.ceil((e.offsetY - 26) / 30);
	// if (matrixUser[coordY - 1][coordX - 1] != 1) {
		let field = document.querySelector('.field-user');
		let div = document.createElement('div');
		div.classList.add('shade');
		div.style.left = 26 + 30 * Math.floor((e.offsetX - 26) / 30) + 'px';
		div.style.top = 26 + 30 * Math.floor((e.offsetY - 26) / 30) + 'px';
		field.appendChild(div); 
	// }
	}
});



// Добавляем в данные каждого корабля массив со строковым предсиавлением его палуб
// ships - отсюда берем координаты  
let toStringCoordShip = function(ships) {
	// Берем все корабли по очереди
	for(let i = 0; i < ships.length; i++) {
		ships[i].coordArr = [];

		// В каждом корабле отталкиваемся от его типа
		for(let j = 0; j < ships[i].type; j++) {
		 	if (ships[i].direction) {
		 		ships[i].coordArr.push('' + (ships[i].coordX + j) + ships[i].coordY);
		 	} else {
		 		ships[i].coordArr.push('' + ships[i].coordX + (ships[i].coordY + j));
		 	} 
		}

	}
}

toStringCoordShip(userShips);
toStringCoordShip(pcShips);



// Обновление данных при выстреле
// numberOfShips - количество оставшихся живых кораблей
// whoseShips - чей корабль 'user' или 'pc' 
// !!! Изменяет содержимое index.html
// shipKilled - тип убитого корабля
let updateNumberOfShips = function (numberOfShips, whoseShips, shipKilled) {
	// !!! Не обновляет данные если финальный выстрел по 10 столбцу

	if (shipKilled) {
		if (shipKilled == 1) numberOfShips[whoseShips].singledeck -= 1;
		else if (shipKilled == 2) numberOfShips[whoseShips].doubledeck -= 1;
		else if (shipKilled == 3) numberOfShips[whoseShips].tripledeck -= 1;
		else if (shipKilled == 4) numberOfShips[whoseShips].fourdeck -= 1;
	}
	
	getElement('.one p.' + whoseShips).textContent = numberOfShips[whoseShips].singledeck;
	getElement('.two p.' + whoseShips).textContent = numberOfShips[whoseShips].doubledeck;
	getElement('.three p.' + whoseShips).textContent = numberOfShips[whoseShips].tripledeck;
	getElement('.four p.' + whoseShips).textContent = numberOfShips[whoseShips].fourdeck;
}

updateNumberOfShips(userAndPCShips, 'user', 0);
updateNumberOfShips(userAndPCShips, 'pc', 0);



// Место хранения координат по которым стрелял компьютер
let pcShots = new Set();

// Логика выстрелов компьютера
let pcLogic = function() {

	let coordX = getRandom(10) + 1;
	let coordY = getRandom(10) + 1;
	let coordString = '' + coordX + coordY;
	// Проверка, есть ли такая координата в pcShots
	// Если, есть перезапускаем ход компьютера
	if (pcShots.has(coordString)) {
		pcLogic();
		console.log('test...')
	} else {
		pcShots.add(coordString);

	// после каждого хода изменять yourMove
	// 1. Переделать в функцию действие по нажатию левой кнопки	

	// 1.
	// [*,*,X,*,*,*,X,*,*,*]
	// [*,*,*,X,*,*,*,X,*,*]
	// [X,*,*,*,X,*,*,*,X,*]
	// [*,X,*,*,*,X,*,*,*,X]
	// [*,*,X,*,*,*,X,*,*,*]
	// [*,*,*,X,*,*,*,X,*,*]
	// [X,*,*,*,X,*,*,*,X,*]
	// [*,X,*,*,*,X,*,*,*,X]
	// [*,*,X,*,*,*,X,*,*,*]
	// [*,*,*,X,*,*,*,X,*,*]
	// 2. 
	// [*,*,*,X,*,*,*,X,*,*]
	// [*,*,X,*,*,*,X,*,*,*]
	// [*,X,*,*,*,X,*,*,*,X]
	// [X,*,*,*,X,*,*,*,X,*]
	// [*,*,*,X,*,*,*,X,*,*]
	// [*,*,X,*,*,*,X,*,*,*]
	// [*,X,*,*,*,X,*,*,*,X]
	// [X,*,*,*,X,*,*,*,X,*]
	// [*,*,*,X,*,*,*,X,*,*]
	// [*,*,X,*,*,*,X,*,*,*]
	// 3. Рандомный ход

	// При попадании обстреливать область вокруг, горизонталь / вертикаль

		if (matrixPC[coordY - 1][coordX - 1] == 1) {
			// Обводка диагоналей
			// Дополнительная 1 для корректного заполнения матрицы
			let diagonal = [[coordY - 1, coordX - 1], [coordY + 1, coordX - 1], [coordY - 1, coordX + 1], [coordY + 1, coordX + 1]];
			// Координаты по которым надо стрелять с учетом сдвига влево-вверх
			// Иду по Х
			// если попал сюда все У удаляются
			// [coordY, coordX-1]
			// [coordY, coordX+1]
			// =============
			// [coordY, coordX-2]
			// [coordY, coordX+2]
			// [coordY, coordX-3]
			// [coordY, coordX+3]
			// Иду по У
			// если попал сюда все X удаляются
			// [coordY-1, coordX]
			// [coordY+1, coordX]
			// =============
			// [coordY-2, coordX]
			// [coordY+2, coordX]
			// [coordY-3, coordX]
			// [coordY+3, coordX]

			// classList.add('shade')
			// console.log((coordX + 1) - 1, (coordY) - 1);
			// console.log((coordX - 1) - 1, (coordY) - 1);
			// console.log((coordX) - 1, (coordY + 1) - 1);
			// console.log((coordX) - 1, (coordY -1 ) - 1);

			// Запомнить координаты попадания, проверить не было ли выстрела до этого
			// Заштриховать если возможно координаты по диагоналям
			// Выбрать куда стрелять, горизонталь / вертикаль
			// Обстреливать область по горизонтали / вертикали

			let field = document.querySelector('.field-pc');
			let div = document.createElement('div');
			div.classList.add('knock');

			div.style.left = 26 + 30 * coordX - 30 + 'px';
			div.style.top = 26 + 30 * coordY - 30 + 'px';
			field.appendChild(div); 

			// если попал
			// 1. стрелять в область [x + 1] [x - 1] [y + 1] [y - 1]
			// 2. если попал по х - стрелять только по нему пока не убьешь,
				// тоже и для у
			// 3. когда убил переходить дальше

			for(let i = 0; i < pcShips.length; i++) {
					if ((pcShips[i].coordArr).indexOf('' + coordX + coordY) != -1) {
						// Заменяю координату палубы в которую попали на 0
						pcShips[i].coordArr[(pcShips[i].coordArr).indexOf('' + coordX + coordY)] = 0; 
						info('Кажется тебя ранили!');
						// Заштриховываем область по диагонали 
						for (let i = 0; i < diagonal.length; i++ ) {
							if (diagonal[i][1] < 11 && diagonal[i][0] < 11 && 
									diagonal[i][1] > 0 && diagonal[i][0] > 0) {
								
								// Прорисовываем на поле заштрихованные области
								// за исключение тех что лежат вне игрового поля
								let field = document.querySelector('.field-pc');

								// Добавляем в pcShots диагональные значения 
								let coordString = '' + diagonal[i][1] + diagonal[i][0];

								// Не закрашивать поля по которым уже стреляли 
								if (!pcShots.has(coordString)) {
									let div = document.createElement('div');
									div.classList.add('shade');								
									div.style.left = 26 + 30 * diagonal[i][1] - 30 + 'px';
									div.style.top = 26 + 30 * diagonal[i][0] - 30 + 'px';
									field.appendChild(div); 									
								}	

								(!pcShots.has(coordString)) ? pcShots.add(coordString) : '';
							}

									
						}


						// печать типа корабля в который попал
						// console.log(pcShips[i].type);
						// if (pcShips[i].type == 1) {
						// 	console.log('single')
						// 	// проставить заштрихованную область вокруг корабля
						// 	// for (let i = 0; i < 8; i++ ) {
						// 		// let field = document.querySelector('.field-user');
						// 		// let div = document.createElement('div');
						// 		// div.classList.add('shade');								
						// 	// }
						// } else if (pcShips[i].type == 2) {

						// } else if (pcShips[i].type == 3) {

						// } else if (pcShips[i].type == 4) {

						// }
						
						// Перевожу массив с координатами корабля в строку и сравниваю с 0
						if (!(parseInt((pcShips[i].coordArr).join('')))) {
							updateNumberOfShips(userAndPCShips, 'pc', pcShips[i].type);
							userAndPCShips.pc.total -= 1;	
							(userAndPCShips.pc.total) ? info('Что он творит!') : info('Допрыгался! Game Over');
							// info('Что он творит!');					
						} 
				} 			
			}	

			// Если PC попал, повторный запуск его хода
			(userAndPCShips.pc.total) ? setTimeout("pcLogic();", 1200) : '';					
		} 

		if (matrixPC[coordY - 1][coordX - 1] == 0 || matrixPC[coordY - 1][coordX - 1] == 2) {
			let field = document.querySelector('.field-pc');
			let div = document.createElement('div');
			div.classList.add('dot');
			div.style.left = 26 + 30 * coordX - 30 + 'px';
			div.style.top = 26 + 30 * coordY - 30 + 'px';
			field.appendChild(div);

			// Передаем ход user'y 
			info('Воин! Действуй')
			game('user');
		}
	console.log(pcShots.size)
				
	}

};



// Логика игры
let startGame = function(firstMove) {
	let field = document.querySelector('.battlefield');
	let div = document.createElement('div');
	div.classList.add('locked');

	// yourMove - Берется из глобальной переменной
	(yourMove) ? div.classList.add('locked-pc') : div.classList.add('locked-user');
	(yourMove) ? info(msgInfo[0]) : div.classList.add('locked-user');
	field.appendChild(div); 
	// Если хожу я смотри field.addEventListener('click' ...

	// Если компьютер ходит первым запускаем его ход
	(firstMove == 'pc') ? setTimeout("pcLogic();", 1200) : '';
};



// POPUP

let yourName = document.querySelector('.popup__your-name--input');
let pcName = document.querySelector('.popup__pc-name--input');

let yourNameButton = document.querySelector('.popup__your-name--button');
let pcNameButton = document.querySelector('.popup__pc-name--button');

let chooseFirstStepPlayer = document.querySelector('.popup__choose-first-move');

info('Введи свое имя');

yourNameButton.addEventListener('click', () => {
	// Проверить, введено ли имя User'a
	// если введено запустить код
	info('Боец! Ты забыл ввести свое имя... Исправь это!');
	if (yourName.value) {
		document.querySelector('.popup__your-name').classList.toggle('hidden');
		document.querySelector('.popup__pc-name').classList.toggle('hidden');	
		info('Введи имя своего противника');	
	}
});

pcNameButton.addEventListener('click', () => {
	// Проверить, введено ли имя PC
	// если введено запустить код
	info('ммм... Боец! Ты забыл ввести имя своего противника');
	if (pcName.value) {
		document.querySelector('.popup__pc-name').classList.toggle('hidden');
		document.querySelector('.popup__choose-first-move').classList.toggle('hidden');
		document.querySelector('.popup__choose-you').value = yourName.value;
		document.querySelector('.popup__choose-pc').value = pcName.value;
		info('Выбирай кто ходит первым');
	}
});

chooseFirstStepPlayer.addEventListener('click', (e) => {
	if (e.target.value === yourName.value || e.target.value === pcName.value) {
		// console.log(`First step: ${e.target.value}`);
		document.querySelector('.popup__choose-first-move').classList.toggle('hidden');
		document.querySelector('.field-user').classList.toggle('hidden');
		document.querySelector('.field-pc').classList.toggle('hidden');
		document.querySelector('.name-user').textContent = yourName.value;
		document.querySelector('.name-pc').textContent = pcName.value;

		// Передаем кто будет делать первый ход
		info('');
		startGame(e.target.getAttribute('data-name'));
	}
});	


// ПОРЯДОК ХОДОВ

let game = function(who) {

	let locked = document.querySelector('.locked');
	if (who == 'pc') {
			// Захожу сюда если промахнулся
			// Захожу сюда если попал pc
			locked.classList.toggle('locked-pc');
			locked.classList.add('locked-user');

			// pcLogic() - Запуск хода PC / возможен в трех местах
			setTimeout("pcLogic();", 1200);		
			}	
	
	if (who == 'user') {
			// Захожу сюда если промахнулся PC
			locked.classList.add('locked-pc')
			locked.classList.toggle('locked-user');
		}
};

