
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
				cell.innerHTML = '<input type="text" class="inputBox" maxlength="2" style="text-transform: uppercase" ' + 'id="' + txtID + '" onfocus="textInputFocus(' + "'" + txtID + "'"+ ')">';
			}
			else{
				cell.style.backgroundColor  = '#0b3648ce';
			}
		}
	}

	addHint();
}

//TODO various puzzles according to cross id 
// add the numbers of the horizontal and vertical hints according to the puzzle
function addHint(){
	document.getElementById("txt_0_6").placeholder = "1";
	document.getElementById("txt_3_0").placeholder = "2";
	document.getElementById("txt_5_2").placeholder = "3";
	document.getElementById("txt_5_3").placeholder = "4";
	document.getElementById("txt_7_6").placeholder = "5";
	document.getElementById("txt_9_2").placeholder = "6";
}

// stores ID of the selected cell into currentTextInput
function textInputFocus(textID){
	currentTextInput = textID;
}

// returns crossword words (solutions)
function prepareCrosswordArray(){
var items = [	[0, 0, 0, 0, 0, 0, 'l', 'a', 'r', 'y', 'n', 'x'],
				[0, 0, 0, 0, 0, 0, 'i', 0, 0, 0, 0, 0 ],
				[0, 0, 0, 0, 0, 0, 'g', 0, 0, 0, 0, 0 ],
				['c','i', 'r', 'c', 'u', 'l', 'a','t', 'i', 'o', 'n', 0],
				[0, 0, 0, 0, 0, 0, 'm', 0, 0, 0, 0, 0 ],
				[0, 0, 'e', 'p', 'i', 'd', 'e', 'r', 'm', 'i', 's', 0],
				[0, 0, 0, 'u', 0, 0, 'n', 0, 0, 0, 0, 0],
				[0, 0, 0, 'p', 0, 0, 't', 'e', 'n', 'd', 'o', 'n'],
				[0, 0, 0, 'i', 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 'p', 'u', 'l', 's', 'e', 0, 0, 0, 0, 0],
			];

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
					selectedInputTextElement.style.backgroundColor = 'red';
					
				}
				else{
					selectedInputTextElement.style.backgroundColor = 'white';
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