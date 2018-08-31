'use strict';
let yourName = document.querySelector('.popup__your-name--input');
let pcName = document.querySelector('.popup__pc-name--input');

let yourNameButton = document.querySelector('.popup__your-name--button');
let pcNameButton = document.querySelector('.popup__pc-name--button');

let chooseFirstStepPlayer = document.querySelector('.popup__choose-first-move');

yourNameButton.addEventListener('click', () => {
	document.querySelector('.popup__your-name').classList.toggle('hidden');
	document.querySelector('.popup__pc-name').classList.toggle('hidden');
	console.log(`You: ${yourName.value}`);
});

pcNameButton.addEventListener('click', () => {
	document.querySelector('.popup__pc-name').classList.toggle('hidden');
	document.querySelector('.popup__choose-first-move').classList.toggle('hidden');
	console.log(`Opponent: ${pcName.value}`);
	document.querySelector('.popup__choose-you').value = yourName.value;
	document.querySelector('.popup__choose-pc').value = pcName.value;
});

chooseFirstStepPlayer.addEventListener('click', (e) => {
	if (e.target.value === yourName.value || e.target.value === pcName.value) {
		console.log(`First step: ${e.target.value}`);
		document.querySelector('.popup__choose-first-move').classList.toggle('hidden');
	}
});	