'use strict';

const inputs = document.querySelectorAll('input[type="text"]');
const billInput = document.getElementById('input-bill');
const peopleInput = document.getElementById('input-people');
const customInput = document.querySelector('.input--custom');
const billErrorText = document.querySelector('#input-bill+.error-text');
const peopleErrorText = document.querySelector('#input-people+.error-text');

const tipBtns = document.querySelectorAll('.btn--tip');
const resetBtn = document.getElementById('button-reset');
const tipOutput = document.getElementById('tip-output');
const totalOutput = document.getElementById('total-output');

let activeBtn = null;

const isInputZero = function (input) {
	return Number(input.value) === 0;
};

const isInputNotInteger = function (input) {
	return !Number.isInteger(Number(input.value));
};

const isInputNotValidNumber = function (input) {
	return isNaN(Number(input.value));
};

const isInputNotInRange = function (input, min, max) {
	return !(+input.value >= min && +input.value <= max);
};

const makeInputNumOnly = function () {
	this.value = this.value.replace(/[^0-9.]/g, '');
};

const canCalculate = function () {
	let btnsIsActive = false;

	for (let btn of tipBtns) {
		if (btn.isActive) {
			btnsIsActive = true;
			break;
		}
	}

	return billInput.isValid && (btnsIsActive || customInput.isValid) && peopleInput.isValid;
};

const calculate = function () {
	const bill = +billInput.value;
	const numPeople = +peopleInput.value;
	let tip;

	if (customInput.isValid) {
		tip = +customInput.value / 100;
	} else {
		for (let tipBtn of tipBtns) {
			if (tipBtn.isActive) {
				tip = Number(tipBtn.textContent.slice(0, -1)) / 100;
			}
		}
	}

	const tipAmountPerPerson = (bill * tip) / numPeople;
	const personTotal = bill / numPeople + tipAmountPerPerson;

	return [tipAmountPerPerson, personTotal];
};

const updateOutputs = function (tipPerPerson, totalPerPerson) {
	tipOutput.textContent = tipPerPerson.toFixed(2);
	totalOutput.textContent = totalPerPerson.toFixed(2);
};

const resetCalc = function () {
	updateOutputs(0, 0);
};

const resetAll = function () {
	billInput.value = '';
	billInput.isValid = false;

	for (let btn of tipBtns) {
		if (btn.isActive) {
			makeBtnInactive(btn);
		}
	}

	customInput.value = '';
	customInput.isValid = false;

	peopleInput.value = '';
	peopleInput.isValid = false;
};

function validateInput(input, errorText) {
	if (input.value === '') {
		errorText.classList.add('hidden');
		input.classList.remove('input--error');

		input.isValid = false;
	} else if (isInputZero(input)) {
		errorText.textContent = "can't be zero";
		errorText.classList.remove('hidden');
		input.classList.add('input--error');

		input.isValid = false;
	} else if (isInputNotValidNumber(input)) {
		errorText.textContent = 'enter a valid number';
		errorText.classList.remove('hidden');
		input.classList.add('input--error');

		input.isValid = false;
	} else {
		errorText.classList.add('hidden');
		input.classList.remove('input--error');

		input.isValid = true;
	}
}

const makeBtnActive = function (btn) {
	btn.classList.add('btn--active');
	btn.isActive = true;
};

const makeBtnInactive = function (btn) {
	btn.classList.remove('btn--active');
	btn.isActive = false;
};

const docUpdate = function () {
	if (canCalculate()) {
		makeBtnActive(resetBtn);
		resetBtn.addEventListener('click', resetAll);
		updateOutputs(...calculate());
	} else {
		makeBtnInactive(resetBtn);
		resetBtn.removeEventListener('click', resetAll);
		resetCalc();
	}
};

for (let input of inputs) {
	input.addEventListener('input', makeInputNumOnly);
	input.value = '';
	input.isValid = false;
}

for (let btn of tipBtns) {
	btn.isActive = false;

	btn.addEventListener('click', function () {
		if (btn.isActive) {
			makeBtnInactive(btn);
		} else {
			for (let tipBtn of tipBtns) {
				if (tipBtn === btn) {
					makeBtnActive(tipBtn);
					continue;
				}

				makeBtnInactive(tipBtn);
			}

			customInput.value = '';
			customInput.classList.remove('input--error');
			customInput.isValid = false;
		}
	});
}

billInput.addEventListener('input', function () {
	validateInput(this, billErrorText);
});

peopleInput.addEventListener('input', function () {
	validateInput(this, peopleErrorText);

	if (isInputNotInteger(this)) {
		peopleErrorText.textContent = "can't be decimal";
		peopleErrorText.classList.remove('hidden');
		this.classList.add('input--error');

		this.isValid = false;
	}
});

customInput.addEventListener('click', function () {
	for (let btn of tipBtns) {
		makeBtnInactive(btn);
	}
});

customInput.addEventListener('input', function () {
	if (this.value === '') {
		this.classList.remove('input--error');

		this.isValid = false;
	} else if (isInputNotValidNumber(this)) {
		this.classList.add('input--error');
		alert('enter a valid number');

		this.isValid = false;
	} else if (isInputNotInRange(this, 0, 100)) {
		this.classList.add('input--error');
		alert('enter a number between 0 and 100');

		this.isValid = false;
	} else {
		this.classList.remove('input--error');

		this.isValid = true;
	}
});

document.addEventListener('click', docUpdate);
document.addEventListener('input', docUpdate);
