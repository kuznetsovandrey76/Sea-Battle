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
var field = document.querySelector('.field');
var test = document.querySelector('.test');


field.addEventListener('mousemove', (e) => {
// field.addEventListener('click', (e) => {
	// offset - координаты блока
	// один кораблик 33px
	// console.log(`x: ${Math.ceil(e.offsetX/33)}, y: ${Math.ceil(e.offsetY/33)}`);
	test.style.left = 33*Math.ceil(e.offsetX/33)-33 + 'px';
	test.style.top = 33*Math.ceil(e.offsetY/33)-33 + 'px';
	document.querySelector('.test').classList.toggle('hidden');
});


