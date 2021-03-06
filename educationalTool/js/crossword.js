
// global variables
var currentTextInput;
var crosswordArrayData;

// loads the crossword
function initializeScreen(){
	var crosswordTable = document.getElementById("crossword");
	crosswordArrayData = prepareCrosswordArray();

	for ( var i = 0; i < crosswordArrayData.length ; i++ ) {

		var row = crosswordTable.insertRow(-1);
		var rowData = crosswordArrayData[i];

		for(var j = 0 ; j < rowData.length ; j++){
			var cell = row.insertCell(-1);

			if(rowData[j] != 0){

				var txtID = String('txt' + '_' + i + '_' + j);
				cell.innerHTML = '<input type="text" class="inputCell" maxlength="2" style="text-transform: uppercase" ' + 'id="' + txtID + '" onfocus="textInputFocus(' + "'" + txtID + "'"+ ')">';
			}
			else{
				cell.style.backgroundColor  = '#0b3648b0';
			}
		}
	}

	addHint();
}

//TODO various puzzles according to cross id 
// add the numbers of the horizontal and vertical hints according to the puzzle
function addHint(){
	document.getElementById("txt_1_7").placeholder = "1";
	document.getElementById("txt_4_1").placeholder = "2";
	document.getElementById("txt_6_3").placeholder = "3";
	document.getElementById("txt_6_4").placeholder = "4";
	document.getElementById("txt_8_7").placeholder = "5";
	document.getElementById("txt_10_2").placeholder = "6";

	// document.getElementById("txt_1_6").placeholder = "1";
	// document.getElementById("txt_3_4").placeholder = "2";
	// document.getElementById("txt_4_1").placeholder = "3";
	// document.getElementById("txt_4_3").placeholder = "4";
	// document.getElementById("txt_6_1").placeholder = "5";
	// document.getElementById("txt_9_8").placeholder = "6";
	// document.getElementById("txt_11_6").placeholder = "7";
	// document.getElementById("txt_18_1").placeholder = "8";

	// document.getElementById("txt_1_12").placeholder = "1";
	// document.getElementById("txt_7_8").placeholder = "2";
	// document.getElementById("txt_8_10").placeholder = "3";
	// document.getElementById("txt_8_12").placeholder = "4";
	// document.getElementById("txt_8_15").placeholder = "5";
	// document.getElementById("txt_9_17").placeholder = "6";
	// document.getElementById("txt_10_7").placeholder = "7";
	// document.getElementById("txt_11_15").placeholder = "8";
	// document.getElementById("txt_13_13").placeholder = "9";
	// document.getElementById("txt_15_13").placeholder = "10";
	// document.getElementById("txt_17_1").placeholder = "11";
}

// stores ID of the selected cell into currentTextInput
function textInputFocus(textID){
	currentTextInput = textID;
}

// returns crossword words (solutions)
function prepareCrosswordArray(){
	var items = [	
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 'l', 'a', 'r', 'y', 'n', 'x', 0],
				[0, 0, 0, 0, 0, 0, 0, 'i', 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 'g', 0, 0, 0, 0, 0, 0],
				[0, 'c','i', 'r', 'c', 'u', 'l', 'a','t', 'i', 'o', 'n', 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 'm', 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 'e', 'p', 'i', 'd', 'e', 'r', 'm', 'i', 's', 0, 0],
				[0, 0, 0, 0, 'u', 0, 0, 'n', 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 'p', 0, 0, 't', 'e', 'n', 'd', 'o', 'n', 0],
				[0, 0, 0, 0, 'i', 0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0,  'p', 'u', 'l', 's', 'e', 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			];

	// var items = [	
	// 			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 0, 0, 'e', 0, 0, 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 0, 0, 'n', 0, 0, 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 'm', 0, 'd', 0, 0, 0, 0, 0, 0, 0, 0],
	// 			[0, 'n', 0, 'r', 'i', 'b', 'o', 's', 'o', 'm', 'e', 's', 0, 0, 0],
	// 			[0, 'u', 0, 0, 't', 0, 'p', 0, 0, 0, 0, 0, 0, 0, 0],
	// 			[0, 'c', 'y', 't', 'o', 'p', 'l', 'a', 's', 'm', 0, 0, 0, 0, 0],
	// 			[0, 'l', 0, 0, 'c', 0, 'a', 0, 0, 0, 0, 0, 0, 0, 0],
	// 			[0, 'e', 0, 0, 'h', 0, 's', 0, 0, 0, 0, 0, 0, 0, 0],
	// 			[0, 'u', 0, 0, 'o', 0, 'm', 0, 'c', 0, 0, 0, 0, 0, 0],
	// 			[0, 's', 0, 0, 'n', 0, 'i', 0, 'h', 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 'd', 0, 'c', 'e', 'l', 'l', 'w', 'a', 'l', 'l', 0],
	// 			[0, 0, 0, 0, 'r', 0, 'r', 0, 'o', 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 'i', 0, 'e', 0, 'r', 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 'a', 0, 't', 0, 'o', 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 0, 0, 'i', 0, 'p', 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 0, 0, 'c', 0, 'l', 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 0, 0, 'u', 0, 'a', 0, 0, 0, 0, 0, 0],
	// 			[0, 'v', 'a', 'c', 'u', 'o', 'l', 'e', 's', 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 0, 0, 'u', 0, 't', 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 0, 0, 'm', 0, 's', 0, 0, 0, 0, 0, 0],
	// 			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	// 		];


	// var items = [	
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'e', 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 's', 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'c', 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'h', 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'e', 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'r', 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 'i', 0, 0, 0, 'i', 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 'n', 0, 't', 0, 'c', 'e', 'l', 'l', 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 't', 0, 'r', 0, 'h', 0, 0, 'y', 0, 'y', 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 'h', 'e', 'p', 'a', 't', 'i', 't', 'i', 's', 0, 'e', 0, 0, 0],
	// 		[0, 0, 0,  0, 0, 0, 0, 0, 'r', 0, 'n', 0, 'a', 0, 0, 'o', 'v', 'a', 'r', 'y', 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 'f', 0, 's', 0, 0, 0, 0, 's', 0, 's', 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 'e', 0, 'p', 0, 0, 'w', 'h', 'o', 0, 't', 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 'r', 0, 'o', 0, 0, 0, 0, 'm', 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 'o', 0, 'r', 0, 0, 'k', 'r', 'e', 'b', 's', 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 'n', 0, 't', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 'n', 'e', 'c', 'r', 'o', 's', 'i', 's', 0, 'e', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'r', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// 		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	// ];

	return items;
}

// "Clear All" Button
function clearAllClicked(){

	var crosswordTable = document.getElementById("crossword");

	currentTextInput = '';
	crosswordTable.innerHTML = '';

	initializeScreen();
}

// "Check" Button
function checkClicked(){

	for ( var i = 0; i < crosswordArrayData.length ; i++ ) {
		var rowData = crosswordArrayData[i];

		for(var j = 0 ; j < rowData.length ; j++){

			if(rowData[j] != 0){

				var selectedInputTextElement = document.getElementById('txt' + '_' + i + '_' + j);
				if(selectedInputTextElement.value != crosswordArrayData[i][j]){
					selectedInputTextElement.style.backgroundColor = '#e74747b4';
					
				}
				else{
					selectedInputTextElement.style.backgroundColor = '#71c93ecb';
				}
			}
		}
	}
}

// "Clue" Button
function clueClicked(){

	if (currentTextInput != null){

		var temp1 = currentTextInput;
		var token = temp1.split("_");
		var row = token[1];
		var column = token[2];

		document.getElementById(temp1).value = crosswordArrayData[row][column];
		//checkClicked();
	}
}

// "Solve" Button
function solveClicked(){

	if (currentTextInput != null){

		var temp1 = currentTextInput;
		var token = temp1.split("_");
		var row = token[1];
		var column = token[2];
		
		// print items on top
		for(j = row; j >= 0; j--){

			if(crosswordArrayData[j][column] != 0){

				document.getElementById('txt' + '_' + j + '_' + column).value = crosswordArrayData[j][column];
			}
			else break;
		}

		// print items on the right
		for(i = column; i< crosswordArrayData[row].length; i++){

			if(crosswordArrayData[row][i] != 0){

				document.getElementById('txt' + '_' + row + '_' + i).value = crosswordArrayData[row][i];
			}
			else break;
		}
		
		// print items below
		for(m = row; m< crosswordArrayData.length; m++){

			if(crosswordArrayData[m][column] != 0){

				document.getElementById('txt' + '_' + m + '_' + column).value = crosswordArrayData[m][column];
			}
			else break;
		}

		// print items to the left
		for(k = column; k >= 0; k--){

			if(crosswordArrayData[row][k] != 0){

				document.getElementById('txt' + '_' + row + '_' + k).value = crosswordArrayData[row][k];
			}
			else break;
		}
	}
}