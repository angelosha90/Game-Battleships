//Создаем модель поведения игры
var model = {
	boardSize: 7, //размер игрового поля
	numShips: 3, //количество кораблей
	shipLength: 3, //длина корабля в клетках
	shipsSunk: 0, //количество потопленных кораблей
	ships: [
			{ locations: [0, 0, 0], hits: ["", "", ""]},
			{ locations: [0, 0, 0], hits: ["", "", ""]}, //массив с координатами кораблей 
			{ locations: [0, 0, 0], hits: ["", "", ""]}
			],
	fire: function(guess) { //данный метод получает координаты выстрела
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			//проверяем, если корабль поражен, то возвращаем true.
			if (ship.hits[index] === "hit") {

				view.displayMessage("Oops, you already hit that location!");
				return true;

			} else if (index >=0) {

				ship.hits[index] = "hit";

				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {

					view.displayMessage("You sank my battelship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.")
		return false;
	},
	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},	
	//генерация кораблей на игровом поле	
	generateShipLocations: function() {
	var locations;
	for (var i = 0; i < this.numShips; i++) {
		do {
			locations = this.generateShip();
		} while (this.collision(locations));
		this.ships[i].locations = locations;
	}
	console.log("Ships array: ");
		console.log(this.ships);

},
	//создаем координаты корабля
	generateShip: function () {
	var direction = Math.floor(Math.random() * 2); //определяем направление корабля
	var row, col;
	if (direction === 1) { //горизонтальное положение корабля

		row = Math. floor(Math.random() * this.boardSize);
		col = Math. floor(Math. random() * (this.boardSize - this.shipLength + 1));

	} else { //вертикальное положение корабля

		row = Math. floor(Math.random() * (this.boardSize - this.shipLength + 1));
		col = Math. floor(Math. random() * this.boardSize);

	}
	 var newShipLocations = []; // хранит массив координат
	 for (var i=0; i<this.shipLength; i++) {
	 	if (direction ===1) { 

	 		newShipLocations.push(row + "" + (col + i));

	 	} else {

	 		newShipLocations.push((row + i) + "" + col);
	 	}
	 }
	 return newShipLocations;
},
	// проверяем не пересекаются ли корабли
	collision: function(locations) {
	for (var i = 0; i < this.numShips; i++) {

		var ship = this.ships[i];

		for (var j = 0; j < locations.length; j++) {

			if (ship.locations.indexOf(locations[j]) >= 0){

				return true;
			}
		}
	}
		return false;
	}
}; 
//создаем объект представления
 var view = {
	displayMessage: function (msg) { 
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) { 
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};
// создаем контроллер
var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location); 
			if (hit && model.shipsSunk === model.numShips)  {
				view.displayMessage("You sank all my battelships, in " + this.guesses + " guesses");
			}
		}
	}
}
//вспомогательная функция для проверки
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !==2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
			} else {
			return row + column;
		}
	}
	return null;
}
// init - вызывается после загрузки страницы
function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton; //при нажатии кнопки будет выполняться функция handleFireButton() 

	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();// размещение кораблей на игровом поле
}
//функция для нажатия через Enter
function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	e = e || window.event;
	if (e.keyCode === 13) { //индификатор Enter
		fireButton.click(); //имитация нажатия кнопки "Fire"
		return false;
	}
} 
//обработчик событий
function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value;
	controller.processGuess(guess); //передача введенных данных контролеру
	guessInput.value = ""; //очищение поля ввода
}
window.onload = init;
