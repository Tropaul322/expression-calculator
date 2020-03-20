function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    var s = expr.replace(/ /g, '');
	var z = openBrackets(s)
	z = countArr(z);
	z = multiplyAndDivide(z);
	return Number(sumAndSubstract(z))
}

const openBrackets = (str) => {
	var newStr = '';
	var arr = [];
	var numberBrackets = 0;
	
	// *Для кажного элемента в строке вызываем цикл, который ищет скобочки
	for (var i = 0; i< str.length; i++) {
		// situation 1 
		// *сравниваем элемент строки с открывающийся скобочкой
		if(str[i] == "(") {
			// количество скобок увеличивается на 1
			numberBrackets += 1;
			// если количество скобок равно 1, то...
			if(numberBrackets == 1) {
				// 1. проверяем если в строке что-то есть, то добавляем в массив
				if(newStr != "") {
					arr.push(newStr);
					newStr = '';
				}
			// если количество скобок больше или меньше 1, то добавляем в строку
			} else {
				newStr+= str[i]
			}
		}
		//  * ищем цифры и знаки
		if(str[i]!= "(" && str[i]!=")") {
			newStr+=str[i];
		}
		// * ищем закрытую скобку
		if(str[i] == ")") {
			numberBrackets = numberBrackets - 1;
			if(numberBrackets == 0) {
				arr.push(newStr);
				newStr = '';
			} else {
				newStr += str[i];
			}
		}
	}
	if(numberBrackets!= 0) {
		throw 'ExpressionError: Brackets must be paired';
	}
	// * если в строке что-то осталось после цикла, то должны добавить в нашу строку 
	if(newStr != "") {
		arr.push(newStr);
		newStr = "";
	}
	
	// * проверяем, если остались еще скобочки. Запускаем рекурсию
	for( var j = 0; j < arr.length; j++) {
		if(arr[j].includes("(") && arr[j].includes(")")) {
			arr[j] = openBrackets(arr[j]);
		}
	}
	// * возвращаем массив
	return arr;

	
}

//* создаем функцию для просчета элементов в массиве и возврата одной строки без скобок
const countArr = (arr) => {
	// i = 0, будет наш вложенный массив, а нам пока он не нужен.
	for (var i = 0; i < arr.length; i++) {
		// проверяем, если в массиве есть еще другие подмассивы.
		if(Array.isArray(arr[i])) {
			//* запускаем рекурсию 
			arr[i] = countArr(arr[i]);
		}
		// вызываем функцию для этого элемента массива
		arr[i] = multiplyAndDivide(arr[i]);
		
		arr[i] = arr[i].replace(/--/g, '+')
		// вызываем функцию для этого элемента массива
		arr[i] = sumAndSubstract(arr[i]);

	}
	arr = arr.join(''); 
	arr = arr.replace(/\+\+/g, '+');
	arr = arr.replace(/\*\+/g, '*');
	arr = arr.replace(/\/\+/g, '/');
	arr = arr.replace(/-\+/g, '-');
	arr = arr.replace(/--/g, '+')
	// возвращаем строку уже с объединенными падстроками
	return arr

}

//* создаем функцию для вычисления умножения и деления
const multiplyAndDivide = (str1) => {
	if (str1[0] == '/') {
		// если есть, то возвращаем строку без изменений 
		return str1 
	}
	// * создаем регулярное выражение
	// example: 25.25 
	// * удалила минус из рег.экс у первого числа
	var regExp = /(\d+\.?\d*)([\*\/])(-?\d+\.?\d*)/;
	// пока в строке имеется совпадения с регулярным выражение, то 
	while(str1.match(regExp)) {
		// функция match возвращает массив, к элементам которого мы можем обращаться 
		var matchResult = str1.match(regExp);
		var result = 0;
		if(matchResult[2] == '*') {
			result = Number(matchResult[1]) * Number(matchResult[3]);
		} else {
			if(matchResult[3] == 0) {
				throw 'TypeError: Division by zero.';
			}
			result = Number(matchResult[1]) / Number(matchResult[3]);
		} 
		// заменяем строку на на наш результат
		str1 = str1.replace(matchResult[0],result.toFixed(20).toString());
	}

	return str1;
}

//* создаем функцию для вычисления сложения и вычитания
const sumAndSubstract = (str2) => {
	// проверяем нет ли в начале или конце строки знаков умножить и поделить 
	if (str2[0] == '*' || str2[0] == '/' || str2.substr(-1) == '*' || str2.substr(-1) == '/' ) {
		// если есть, то возвращаем строку без изменений 
		return str2 
	}
	var regExp = /(-?\d+\.?\d*)([\+-])(-?\d+\.?\d*)/;
	// пока в строке имеется совпадения с регулярным выражение, то 
	while(str2.match(regExp)) {
		var matchResult = str2.match(regExp);
		var result = 0;
		if(matchResult[2] == '+') {
			result = Number(matchResult[1]) + Number(matchResult[3]);
		} else {
			result = Number(matchResult[1]) - Number(matchResult[3]);
		} 
		str2 = str2.replace(matchResult[0],result.toString());
	}

	return str2;
}


module.exports = {
    expressionCalculator
}
