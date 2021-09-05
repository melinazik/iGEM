const questions = [
    

]

// save the selected questions out of all available questions
var shuffledQuestions = [] 

// shuffle and choose 10 random questions 
function handleQuestions() { 
    
    while (shuffledQuestions.length <= 9) {
        const random = questions[Math.floor(Math.random() * questions.length)]

        if (!shuffledQuestions.includes(random)) {
            shuffledQuestions.push(random)
        }
    }
}

var questionNumber = 1;  // current question number
var playerScore = 0;     // player score
var wrongAttempt = 0;    // number of wrong answers 
var indexNumber = 0;     // counter to display next question

// display next question 
// display player and quiz information 
function nextQuestion(index) {

    handleQuestions()
    const currentQuestion = shuffledQuestions[index];

    document.getElementById("question-number").innerHTML = questionNumber;
    document.getElementById("player-score").innerHTML = playerScore;
    document.getElementById("display-question").innerHTML = currentQuestion.question;
    document.getElementById("option-one-label").innerHTML = currentQuestion.optionA;
    document.getElementById("option-two-label").innerHTML = currentQuestion.optionB;
    document.getElementById("option-three-label").innerHTML = currentQuestion.optionC;
    document.getElementById("option-four-label").innerHTML = currentQuestion.optionD;
}

function checkForAnswer() {
    const currentQuestion = shuffledQuestions[indexNumber]       //gets current question 
    const currentQuestionAnswer = currentQuestion.correctOption; //gets current question's answer
    const options = document.getElementsByName("option");        //gets all options of a question
    var correctOption = null;

    options.forEach((option) => {
        if (option.value === currentQuestionAnswer) {
            
            // correct radio input with correct answer
            correctOption = option.labels[0].id;
        }
    })

    // check if a radio input has been checked 
    //          or an option has been chosen
    if (options[0].checked === false && 
        options[1].checked === false && 
        options[2].checked === false && 
        options[3].checked == false) {
        document.getElementById('option-modal').style.display = "flex";
    }

    //check if checked radio button is same as the correct answer
    options.forEach((option) => {
        if (option.checked === true && option.value === currentQuestionAnswer) {
            document.getElementById(correctOption).style.backgroundColor = "green";
            playerScore++; // increase player's score
            indexNumber++; // increase index to display next question
            
            // delay change of question number util the next question loads
            setTimeout(() => {
                questionNumber++;
            }, 1000);
        }

        else if (option.checked && option.value !== currentQuestionAnswer) {
            const wrongLabelId = option.labels[0].id;
            document.getElementById(wrongLabelId).style.backgroundColor = "red";
            document.getElementById(correctOption).style.backgroundColor = "green";
            wrongAttempt++; //adds 1 to wrong attempts 
            indexNumber++;

            // delay change of question number util the next question loads
            setTimeout(() => {
                questionNumber++;
            }, 1000);
        }
    })
}

// next question button
function handleNextQuestion() {

    checkForAnswer(); //check if answer is right or wrong 
    clearRadioButtons();

    setTimeout(() => {
        if (indexNumber <= 9) {
            nextQuestion(indexNumber);
        }
        else {
            endGame();
        }

        resetOptionColor();
    }, 1000);
}

//sets option colors to null after displaying the right/wrong colors
function resetOptionColor() {
    const options = document.getElementsByName("option");
    options.forEach((option) => {
        document.getElementById(option.labels[0].id).style.backgroundColor = "";
    })
}

// clear radio buttons for next question
function clearRadioButtons() {
    const options = document.getElementsByName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].checked = false;
    }
}

// game finished - function
function endGame() {

    let remark = null;
    let remarkColor = null;

    // display player feedback according to score
    if (playerScore <= 3) {
        remark = "Not so good. Keep Practicing!";
        remarkColor = "red";
    }
    else if (playerScore >= 4 && playerScore < 7) {
        remark = "Okay. You can do better!";
        remarkColor = "orange";
    }
    else if (playerScore >= 7) {
        remark = "Amazing! Keep up the good work.";
        remarkColor = "green";
    }

    const playerGrade = (playerScore / 10) * 100;

    // score board
    document.getElementById('remarks').innerHTML = remark;
    document.getElementById('remarks').style.color = remarkColor;
    document.getElementById('grade-percentage').innerHTML = playerGrade;
    document.getElementById('wrong-answers').innerHTML = wrongAttempt;
    document.getElementById('right-answers').innerHTML = playerScore;
    document.getElementById('score-modal').style.display = "flex";

}

// 1. close score modal
// 2. reset game 
// 3. reshuffle questions

function resetScore() {
    questionNumber = 1;
    playerScore = 0;
    wrongAttempt = 0;
    indexNumber = 0;
    shuffledQuestions = [];
    nextQuestion(indexNumber);
    document.getElementById('score-modal').style.display = "none";
}

//function to close warning modal
function closeWarning() {
    document.getElementById('option-modal').style.display = "none"
}