
let getElement = function (className) {
	return document.querySelector(className);
}; 


let getRandom = function(n) {
	return Math.floor(Math.random() * n);
};

let randomCoordinate = function() {
	// this.x = getRandom(10);
	// this.y = getRandom(10);
	return getRandom(10);
};

let randomShip = function() {
	let types = ['singledeck','fourdeck','tripledeck','doubledeck'];
	let directions = ['right', 'bottom'];
	// Рандомный тип корабля
	this.type = getRandom(4);
	// Рандомное направление // 
	this.direction = getRandom(2);
	// console.log(`type: ${this.type+1}`, `direction: ${directions[this.direction]}`);
	// Проверка, если корабль расположен по горизонтали
	if (this.direction == 0) {
		this.x = getRandom(10);
		while (this.x + this.type > 10) {
			// console.log('ERR x,', `type: ${this.type+1}`, `coordX: ${this.x+1}`)
			this.x = getRandom(10); 
		}
		this.y = getRandom(10);
		// console.log('ok x,', `type: ${this.type+1}`, `coordX: ${this.x+1}`)		
	}
	// Проверка, если корабль расположен по вертикали
	if (this.direction == 1) {
		this.y = getRandom(10);
		while (this.y + this.type > 10) {
			// console.log('ERR y,', `type: ${this.type+1}`, `coordY: ${this.y+1}`)
			this.type = getRandom(4); 
		}
		this.x = getRandom(10);
		// console.log('ok y,', `type: ${this.type+1}`, `coordY: ${this.x+1}`)	
	}

	// console.log(`ship: ${this.type+1}, coordX: ${this.x+1}, coordY: ${this.y+1}, direction: ${directions[this.direction]}`);
	return {
		type: this.type+1,
		coordX: this.x+1,
		coordY: this.y+1,
		direction: directions[this.direction]
	}
};


// console.log(randomShip());

let ships = {
	one: 4,
	two: 3,
	three: 2,
	four: 1
}

let shipStatus = {
	пусто : 1,
	попал: 2,
	нельзя: 3,
	мимо: 4
}

let Pole =  {
	pole: [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		],
	add: function(func) {
		console.log(func());
	},
	show: function() {
		console.log(this.pole);
	},
	change: function(x, y) {
		this.pole[x][y] = 1;
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
	}

	// let div = document.createElement('div');
	// div.classList.add((text.value === 'blue' || text.value === 'tomato') ? text.value : 'test');
	// div.textContent = 'World';
	// field.appendChild(div);
// field.addEventListener('click', (e) => {
	// offset - координаты блока
	// один кораблик 33px
	// console.log(`x: ${Math.ceil((e.offsetX-26)/30)}, y: ${Math.ceil((e.offsetY-26)/30)}`);
	// test.style.left = 30*Math.ceil(e.offsetX/30)-30 + 'px';
	// test.style.top = 30*Math.ceil(e.offsetY/30)-30 + 'px';
	// document.querySelector('.one').classList.toggle('hidden');
});


// Создаем двумерный массив: rows - строки, columns - столбцы
let create2dArray = function (rows, columns) {
   let arr = new Array(rows).fill(0);
   for (let i = 0; i < rows; i++) {
       arr[i] = new Array(columns).fill(0);
   }
   return arr;
}