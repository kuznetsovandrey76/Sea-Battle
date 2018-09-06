// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// Получить элемент по классу
var getElement = function (className) {
	return document.querySelector(className);
}; 

// Получить случайное число
var getRandom = function(n) {
	return Math.floor(Math.random() * n);
};

// Флаг - чей ход
var yourMove = false;

// Время обдумывания компьютером
var timePcThink = 1000;

// Если при первоначальном выборе, выбран User, изменить флаг 
getElement('.popup__choose-you').addEventListener('click', function () {
	yourMove = true;	
});

// Изменить style для не IE браузеров
var body = getElement('.body');
(function() {
	var browser = navigator.userAgent.toString().toLowerCase();
	if (browser.indexOf('msie') == -1) {
		body.classList.add('body-for-not-ie');
	}
})();



// MATRIX

// Создать двумерный массив: 
// rows - строки, columns - столбцы
var create2dArray = function create2dArray(rows, columns) {
   var arr = Array(rows);
   for (var i = 0; i < rows; i++) {
      arr[i] = Array.apply(null, Array(10)).map(Number.prototype.valueOf, 0);
   }
   return arr;
};


// Матрицы для координат
// matrixUser - поле по которому стреляет User
var matrixUser = create2dArray(10, 10); 
var matrixPC = create2dArray(10, 10); 



// SHIPS 
// userShips - корабли по которым стреляет User
var userShips = [];
var pcShips = [];

// Создать корабль 
// + проверка, не пересекают ли координаты корабля границу поля 
var randomShip = function(type) {
	// где type - число, количество палуб корабля
	// 1 - singledeck
	// 2 - doubledeck
	// 3 - tripledeck
	// 4 - fourdeck
	this.type = type;

	// Расположение корабля
	// 1 - right / горизонталь, 0 - bottom / вертикаль  
	this.direction = getRandom(2);

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
var check = function(ship, matrix) {
	this.ship = ship;

	for(var i = 0; i < this.ship.type; i++) {
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
var addShip = function(ship, matrix) {
	for(var i = 0; i < ship.type; i++) {
		if (ship.direction == 1) {
			// Отмечаем координаты корабля - 1
			matrix[ship.coordY - 1][ship.coordX - 1 + i] = 1;
		} else {
			matrix[ship.coordY - 1 + i][ship.coordX - 1] = 1;
		}
	}  

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
			for(var i = 0; i < ship.type; i++) {
				matrix[ship.coordY - 2][ship.coordX - 1 + i] = 2;
			}
		}
		// Отмечаем Рамку снизу
		if (ship.coordY + 1 < 11) {
			for(var i = 0; i < ship.type; i++) {
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
			for(var i = 0; i < ship.type; i++) {
				matrix[ship.coordY - 1 + i][ship.coordX - 2] = 2;	
			}
		}
		// Отмечаем Рамку справа
		if (ship.coordX + 1 < 11) {
			for(var i = 0; i < ship.type; i++) {
				matrix[ship.coordY - 1 + i][ship.coordX] = 2;	
			}
		}

	}
};

// Создать один корабль
// func - функция создания корабля
// type - тип данного корабля
var createShip = function(func, type) {
	var ship = func(type); 
	return ship;
};

// Создаем все 10 кораблей
// matrix - в чью матрицу добавляется корабль
// whoseShips - чей корабль, User или PC
var addAllShips = function(matrix, whoseShips) {

	// Порядок расстоновки кораблей
	// Начать с четырехпалубного, закончить однопалубными 
	var arr = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

	for(var i = 0; i < arr.length; i++ ) {
	
		// Создать рандомный корабль
		var ship = check(createShip(randomShip, arr[i]), matrix);

		// Проверить свободно ли место для размещения
		while (!ship) {
			ship = check(createShip(randomShip, arr[i]), matrix);
		}

		// Добавить в массив, координаты кораблей, для последующей прорисовки
		whoseShips.push(ship);

	 	// Когда проверка пройдена, добавление коробля в матрицу вместе с обводкой
		addShip(ship, matrix);	
	} 
};

// Заполнение матриц рандомными кораблями
addAllShips(matrixUser, userShips);
addAllShips(matrixPC, pcShips);


// Прорисовка кораблей
var drawShips = function(arr, user) {
	for (var i = 0; i < arr.length; i++) {

		var coordX = arr[i].coordX * 30 - 5; 
		var coordY = arr[i].coordY * 30 - 5;
		var width = arr[i].direction ? arr[i].type * 30 : 30;
		var height = arr[i].direction ? 30 : arr[i].type * 30;

		// Добавляем корабль на поле
		var field = document.querySelector(user);
		
		var div = document.createElement('div');
		// Скрываю корабли при добавлении на поле user'a
		(user == '.field-user') ? div.classList.add('ship', 'hidden') : div.classList.add('ship');

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
var info = function(msg) {
	getElement('.info').textContent = msg;
}



// SHOT

var field = getElement('.field');

// Количество оставшихся живых кораблей
var userAndPCShips = {
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
field.addEventListener('click', function(e) {
	// 26px расстояние до внутреннего поля в playfield.png
	if (e.offsetX - 26 > 2 && 
		e.offsetX - 26 < 300 &&
		e.offsetY - 26 > 2 &&
		e.offsetY - 26 < 300) {

		var coordX = Math.ceil((e.offsetX - 26) / 30);
		var coordY = Math.ceil((e.offsetY - 26) / 30);

		// Координаты выстрела в виде строки, для взаимодействия с coordArr
		// console.log('' + coordX + coordY);

		// Проверка куда произведен выстрел
		// 0 - мимо
		// 1 - попал
		// 2 - мимо / обводка корабля

		// Действия при ПОПАДАНИИ по кораблю 
		if (matrixUser[coordY - 1][coordX - 1] == 1) {
			var field = document.querySelector('.field-user');
			var div = document.createElement('div');

			// Прорисовываем попадание крестом
			div.classList.add('knock');
			div.style.left = 26 + 30 * Math.floor((e.offsetX - 26) / 30) + 'px';
			div.style.top = 26 + 30 * Math.floor((e.offsetY - 26) / 30) + 'px';
			field.appendChild(div); 

			info('Есть пробитие ');

			// При попадании, находим в какой тип корабля попал,
			// изменяем данные в coordArr
			for(var i = 0; i < userShips.length; i++) {
					if ((userShips[i].coordArr).indexOf('' + coordX + coordY) != -1) {

						// Заменяю координату палубы в которую попали на 0
						userShips[i].coordArr[(userShips[i].coordArr).indexOf('' + coordX + coordY)] = 0; 
						
						// Перевожу массив с координатами корабля в строку и сравниваю с 0
						if (!(parseInt((userShips[i].coordArr).join('')))) {
							// Обратит внимание userAndPCShips и userShips разные массивы
							
							info('Убил! Продолжай в том же духе')
							updateNumberOfShips(userAndPCShips, 'user', userShips[i].type);	
							userAndPCShips.user.total -= 1;					
						} 
				} 			
			}			
		} 


		// Действия при ПРОМАХЕ 
		if (matrixUser[coordY - 1][coordX - 1] == 0 || matrixUser[coordY - 1][coordX - 1] == 2) {
			var field = document.querySelector('.field-user');
			var div = document.createElement('div');

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
		var field = document.querySelector('.battlefield');
		var div = document.createElement('div');
		div.classList.add('locked');
		div.classList.add('locked-user');
		field.appendChild(div); 
		info('Yahoo! Вы победили');
	}

});

// Действия при нажатии User'ом правой кнопки по игровому полю 
field.addEventListener('contextmenu', function(e) {
	// Убираем значение по умолчанию
	e.preventDefault();
	
	// Убираем ранее добавленный shade
	if (e.target.classList.valueOf() == 'shade') {
		e.target.classList.add('hidden');
	}

	if (e.offsetX - 26 > 2 && 
	e.offsetX - 26 < 300 &&
	e.offsetY - 26 > 2 &&
	e.offsetY - 26 < 300) {

		var coordX = Math.ceil((e.offsetX - 26) / 30);
		var coordY = Math.ceil((e.offsetY - 26) / 30);
		var field = document.querySelector('.field-user');
		var div = document.createElement('div');
		div.classList.add('shade');
		div.style.left = 26 + 30 * Math.floor((e.offsetX - 26) / 30) + 'px';
		div.style.top = 26 + 30 * Math.floor((e.offsetY - 26) / 30) + 'px';
		field.appendChild(div); 
	}
});



// Добавляем в данные каждого корабля массив со строковым предсиавлением его палуб
// ships - отсюда берем координаты  
var toStringCoordShip = function(ships) {

	// Берем все корабли по очереди
	for(var i = 0; i < ships.length; i++) {
		ships[i].coordArr = [];

		// В каждом корабле отталкиваемся от его типа
		for(var j = 0; j < ships[i].type; j++) {
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
var updateNumberOfShips = function (numberOfShips, whoseShips, shipKilled) {
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
// Изначально использовал new Set(), не поддерживает IE 
var pcShotsArr = [];

// Временная переменная, сохранять координаты кораблей в которые попал но еще не убил
var tempNotKilled = {
	coord: [],
	direction: undefined
};


// Логика выстрелов компьютера
var pcLogic = function() {

	// Переменные для записи координат 
	var coordString, coordX, coordY;

	// Проверяем, было ли попадание до этого выстрела
	// Если НЕ было, используем случайные величины
	if (!tempNotKilled.coord.length) {
		coordX = getRandom(10) + 1;
		coordY = getRandom(10) + 1;
		coordString = '' + coordX + coordY;

	// Если было попадание по палубе, обстреливаем область вокруг
	} else {

		// Работа с ДВУХпалубными кораблями
		if (tempNotKilled.coord.length == 1) {
			coordX = tempNotKilled.coord[0][1]
			coordY = tempNotKilled.coord[0][0]

			// Переменная для записи координат возможных выстрелов
			var nextShots;

			// Возможные координаты в зависимости от места попадания в первую палубу
			if (coordX == 1 && coordY == 1) {
				nextShots = [[coordY, coordX + 1], [coordY + 1, coordX]];
			} else if (coordX == 1 && coordY == 10) {
				nextShots = [[coordY, coordX + 1], [coordY - 1, coordX]];
			} else if (coordX == 10 && coordY == 1) {
				nextShots = [[coordY, coordX - 1], [coordY + 1, coordX]];
			} else if (coordX == 10 && coordY == 10) {
				nextShots = [[coordY, coordX - 1], [coordY - 1, coordX]];
			} else if (coordX == 1) {
				nextShots = [[coordY, coordX + 1], [coordY - 1, coordX], [coordY + 1, coordX]];				
			} else if (coordX == 10) {
				nextShots = [[coordY, coordX - 1], [coordY - 1, coordX], [coordY + 1, coordX]];				
			} else if (coordY == 1) {
				nextShots = [[coordY, coordX - 1], [coordY, coordX + 1], [coordY + 1, coordX]];
			} else if (coordY == 10) {
				nextShots = [[coordY, coordX - 1], [coordY, coordX + 1], [coordY - 1, coordX]];
			} else {
				nextShots = [[coordY, coordX - 1], [coordY, coordX + 1], [coordY - 1, coordX], [coordY + 1, coordX]];
				
			}
			var temp = getRandom(nextShots.length);
			coordX = nextShots[temp][0];
			coordY = nextShots[temp][1];
			coordString = '' + coordX + coordY;
		} 

		// Работа с ТРЕХпалубными кораблями
		if (tempNotKilled.coord.length == 2) {

			// Отталкиваемся от координат второго корабля 
			coordX = tempNotKilled.coord[1][0]
			coordY = tempNotKilled.coord[1][1]
			var nextShots;

			// по уже имеющимся координатам определить направление корабля
			// 1 - горизонтальное
			// 0 - вертикальное
									 // X - первого корабля 	   Х - второго корабля  
			tempNotKilled.direction = (tempNotKilled.coord[0][0] - tempNotKilled.coord[1][0]) ? 1 : 0;
			
			// Если расположение горизонтальное
			if (tempNotKilled.direction) {

				// Вторая палуба СЛЕВА от первой
				if (tempNotKilled.coord[1][0]-tempNotKilled.coord[0][0] == -1) {

					if (coordX == 1) {
						nextShots = [[coordX + 2, coordY]];	
					} else if (coordX == 9) {
						nextShots = [[coordX - 1, coordY]];
					} else {
						nextShots = [[coordX - 1, coordY], [coordX + 2, coordY]];
					}

				// Вторая палуба СПРАВА от первой 				
				} else {

					if (coordX == 2) {
						// Левая граница
						nextShots = [[coordX + 1, coordY]];	
						// Правая граница 
					} else if (coordX == 10) {
						nextShots = [[coordX - 2, coordY]];
					} else {
						nextShots = [[coordX - 2, coordY], [coordX + 1, coordY]];
					}
				} 

			// Если расположение по вертикали
			} else {

				// Вторая палуба НАД первой
				if (tempNotKilled.coord[1][1] - tempNotKilled.coord[0][1] == -1) {
					if (coordY == 1) {
						nextShots = [[coordX, coordY + 2]];				
					} else if (coordX == 9) {
						nextShots = [[coordX, coordY - 1]];
					} else {
						nextShots = [[coordX, coordY + 2], [coordX, coordY - 1]];
					}

				// Вторая палуба ПОД первой 
				} else {
					if (coordY == 2) {
						nextShots = [[coordX, coordY + 1]];	
					} else if (coordY == 10) {
						nextShots = [[coordX, coordY - 2]];					
					} else {
						nextShots = [[coordX, coordY + 1], [coordX, coordY - 2]];
					}
				} 
			}

			var temp = getRandom(nextShots.length);
			coordX = nextShots[temp][0];
			coordY = nextShots[temp][1];
			coordString = '' + coordX + coordY;
		}

		// Работа с четырехпалубным кораблем
		if (tempNotKilled.coord.length == 3) 	{

				// Отталкиваемся от координат второго корабля 
				coordX;
				coordY;			
				var nextShots;
			
			// Если расположение горизонтальное
			if (tempNotKilled.direction) {

				// coordY - постоянная
				coordY = tempNotKilled.coord[0][1];

				// отталкиваемся от центральной палубы
				coordX = (tempNotKilled.coord[0][0] + tempNotKilled.coord[1][0] + tempNotKilled.coord[2][0])/3;
				if (coordX - 1 == 1) {
					nextShots = [[coordX + 2, coordY]];					
				} else if (coordX + 1 == 10) {
					nextShots = [[coordX - 2, coordY]];
				} else {
					nextShots = [[coordX + 2, coordY], [coordX - 2, coordY]];
				}			

			// Если расположение вертикальное
			} else {

				// coordX - постоянная
				coordX = tempNotKilled.coord[0][0];

				// отталкиваемся от центральной палубы
				coordY = (tempNotKilled.coord[0][1] + tempNotKilled.coord[1][1] + tempNotKilled.coord[2][1])/3;
				if (coordY - 1 == 1) {
					nextShots = [[coordX, coordY + 2]];					
				} else if (coordY + 1 == 10) {
					nextShots = [[coordX, coordY - 2]];
				} else {
					nextShots = [[coordX, coordY + 2], [coordX, coordY - 2]];
				}
		}

			var temp = getRandom(nextShots.length);
			coordX = nextShots[temp][0];
			coordY = nextShots[temp][1];
			coordString = '' + coordX + coordY;
		}
	}

	// Проверка, есть ли такая координата в pcShotsArr
	// Если, есть перезапускаем ход компьютера
	if(pcShotsArr.indexOf(coordString) != -1) {
		pcLogic();

	// Если нет добавляем в множество pcShots новое значение 
	} else {
		// Координаты по которым стрелял компьютер
		pcShotsArr.push(coordString);

		// При попадании обстреливать область вокруг, горизонталь / вертикаль
		// Действия при Попадании в корабль User'a
		if (matrixPC[coordY - 1][coordX - 1] == 1) {

			// Временная переменная с координатами последнего попадания
			tempNotKilled.coord.push([coordX, coordY]);

			// [вспомогательная переменная] Обводка диагоналей
			var diagonal = [[coordY - 1, coordX - 1], [coordY + 1, coordX - 1], [coordY - 1, coordX + 1], [coordY + 1, coordX + 1]];

			var field = document.querySelector('.field-pc');
			var div = document.createElement('div');
			div.classList.add('knock');
			div.style.left = 26 + 30 * coordX - 30 + 'px';
			div.style.top = 26 + 30 * coordY - 30 + 'px';
			field.appendChild(div); 

			// Ищу через coordArr какому кораблю принадлежат координаты попадания 
			for(var i = 0; i < pcShips.length; i++) {
					if ((pcShips[i].coordArr).indexOf('' + coordX + coordY) != -1) {	

						// Заменяю координату палубы в которую попали на 0
						pcShips[i].coordArr[(pcShips[i].coordArr).indexOf('' + coordX + coordY)] = 0; 

						// Подсказка, ранение
						info('Кажется тебя ранили!');

						// Заштриховываем область по диагоналям координаты попадания 
						for (var j = 0; j < diagonal.length; j++ ) {

							// Прорисовываем на поле заштрихованные области
							// за исключение тех что лежат вне игрового поля
							if (diagonal[j][1] < 11 && diagonal[j][0] < 11 && 
									diagonal[j][1] > 0 && diagonal[j][0] > 0) {
								
								var field = document.querySelector('.field-pc');

								// Добавляем в pcShots диагональные значения 
								// Чтобы не стрелять повторно в заштрихованную область
								var coordString = '' + diagonal[j][1] + diagonal[j][0];

								// Не заштриховывать поля по которым уже стреляли 
								if (pcShotsArr.indexOf(coordString) == -1) {
									var div = document.createElement('div');
									div.classList.add('shade');								
									div.style.left = 26 + 30 * diagonal[j][1] - 30 + 'px';
									div.style.top = 26 + 30 * diagonal[j][0] - 30 + 'px';
									field.appendChild(div); 									
								}	

								(pcShotsArr.indexOf(coordString) == -1) ? pcShotsArr.push(coordString) : '';
							}									
						}
						
						// Действия при Убийстве корабле
						// Перевожу массив coordArr с координатами корабля в строку и сравниваю с 0
						console.log((parseInt((pcShips[i].coordArr).join(''))));

						if ((parseInt((pcShips[i].coordArr).join(''))) == 0) {

							// Заштриховываем область по диагоналям координаты попадания 
							for (var j = 0; j < tempNotKilled.coord.length; j++) {
								console.log('test j', j)

								// Прокрутить координаты каждой палубы
								var coordY = tempNotKilled.coord[j][1];
								var coordX = tempNotKilled.coord[j][0];

								// [вспомогательная переменная] Обводка боковых полей, убитых кораблей 
								var neighbourhood = [[coordY, coordX - 1], [coordY, coordX + 1], [coordY - 1, coordX], [coordY + 1, coordX]];
							

								// Обработка четырех направлений одной координаты
								for (var iter = 0; iter < 4; iter++ ) {

									// Прорисовываем на поле заштрихованные области
									// за исключение тех что лежат вне игрового поля
									if (neighbourhood[iter][1] < 11 && neighbourhood[iter][0] < 11 && 
											neighbourhood[iter][1] > 0 && neighbourhood[iter][0] > 0) {
										
										var field = document.querySelector('.field-pc');

										// Добавляем в pcShots диагональные значения 
										// Чтобы не стрелять повторно в заштрихованную область
										var coordString = '' + neighbourhood[iter][1] + neighbourhood[iter][0];

										// Не заштриховывать поля по которым уже стреляли 
										if (pcShotsArr.indexOf(coordString) == -1) {
											var div = document.createElement('div');
											div.classList.add('shade');								
											div.style.left = 26 + 30 * neighbourhood[iter][1] - 30 + 'px';
											div.style.top = 26 + 30 * neighbourhood[iter][0] - 30 + 'px';
											field.appendChild(div); 									
										}	

										(pcShotsArr.indexOf(coordString) == -1) ? pcShotsArr.push(coordString) : '';
									}									
								}
							}

							// Сбрасываю временную переменную в которой содержаться координаты палуб
							tempNotKilled.coord = [];

							updateNumberOfShips(userAndPCShips, 'pc', pcShips[i].type);

							// Убавить общее количество кораблей
							userAndPCShips.pc.total -= 1;	

							// Подсказка, убийство корабля и концовка игры 
							(userAndPCShips.pc.total) ? info('Что он творит!') : info('Допрыгался! Game Over');
						} 
				} 			
			}	

			// Если PC попал, повторный запуск его хода
			(userAndPCShips.pc.total) ? setTimeout("pcLogic();", timePcThink) : '';					
		} 

		// Действия при Промахе 
		if (matrixPC[coordY - 1][coordX - 1] == 0 || matrixPC[coordY - 1][coordX - 1] == 2) {
			var field = document.querySelector('.field-pc');
			var div = document.createElement('div');
			div.classList.add('dot');
			div.style.left = 26 + 30 * coordX - 30 + 'px';
			div.style.top = 26 + 30 * coordY - 30 + 'px';
			field.appendChild(div);

			// Передаем ход User'y 
			info('Воин! Действуй')
			game('user');
		}
				
	}
};


// Логика игры
// firstMove - выбирается в начале игры
var startGame = function(firstMove) {
	var field = document.querySelector('.battlefield');
	var div = document.createElement('div');
	div.classList.add('locked');

	// yourMove - Берется из глобальной переменной
	(yourMove) ? div.classList.add('locked-pc') : div.classList.add('locked-user');
	(yourMove) ? info('Погнали. Твой ход') : div.classList.add('locked-user');
	field.appendChild(div); 

	// Если хожу я смотри field.addEventListener('click' ...
	// Если компьютер ходит первым запускаем его ход
	(firstMove == 'pc') ? setTimeout("pcLogic();", timePcThink) : '';
};



// POPUP

// Имена игроков
var yourName = getElement('.popup__your-name--input');
var pcName = getElement('.popup__pc-name--input');

// Для передачи имен
var yourNameButton = getElement('.popup__your-name--button');
var pcNameButton = getElement('.popup__pc-name--button');

var chooseFirstStepPlayer = getElement('.popup__choose-first-move');

info('Введи свое имя');

yourNameButton.addEventListener('click', function() {

	// Проверить, введено ли имя User'a
	// Если имя не введено, выводить сообщение
	info('Боец! Ты забыл ввести свое имя... Исправь это!');

	// Имя введено, запустить код
	if (yourName.value) {
		document.querySelector('.popup__your-name').classList.toggle('hidden');
		document.querySelector('.popup__pc-name').classList.toggle('hidden');	
		info('Введи имя своего противника');	
	}
});

pcNameButton.addEventListener('click', function() {

	// Проверить, введено ли имя PC
	info('ммм... Боец! Ты забыл ввести имя своего противника');

	if (pcName.value) {
		document.querySelector('.popup__pc-name').classList.toggle('hidden');
		document.querySelector('.popup__choose-first-move').classList.toggle('hidden');
		document.querySelector('.popup__choose-you').value = yourName.value;
		document.querySelector('.popup__choose-pc').value = pcName.value;
		info('Выбирай кто ходит первым');
	}
});

chooseFirstStepPlayer.addEventListener('click', function(e) {
	if (e.target.value === yourName.value || e.target.value === pcName.value) {
		document.querySelector('.popup__choose-first-move').classList.toggle('hidden');
		document.querySelector('.field-user').classList.toggle('hidden');
		document.querySelector('.field-pc').classList.toggle('hidden');
		document.querySelector('.name-user').textContent = yourName.value;
		document.querySelector('.name-pc').textContent = pcName.value;

		// Передаем кто будет делать первый ход
		// Очищаем поле для сообщений
		info('');
		startGame(e.target.getAttribute('data-name'));
	}
});	


// ПОРЯДОК ХОДОВ

// Блокировка поля для выстрелов
var game = function(who) {

	var locked = document.querySelector('.locked');
	if (who == 'pc') {

			// Захожу сюда если промахнулся User
			// Захожу сюда если попал pc
			locked.classList.toggle('locked-pc');
			locked.classList.add('locked-user');

			setTimeout("pcLogic();", timePcThink);		
			}	
	
	if (who == 'user') {

			// Захожу сюда если промахнулся PC
			locked.classList.add('locked-pc')
			locked.classList.toggle('locked-user');
		}
};


