window.onload = function () {

    var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
          'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
          't', 'u', 'v', 'w', 'x', 'y', 'z'];
    
    var categories;         // array of topics
    var chosenCategory;     // selected category
    var getHint;            // word getHint
    var word ;              // selected word
    var guess ;             // guess
    var guesses = [ ];      // stored guesses
    var lives ;             // lives
    var counter ;           // count correct guesses
    var space;              // number of spaces in word (_)
    
    // get elements
    var showLives = document.getElementById("mylives");
    var showCategory = document.getElementById("scategory");
    var getHint = document.getElementById("hint");
    var showClue = document.getElementById("clue");  
    
    
    
    // create alphabet ul
    var buttons = function () {
        myButtons = document.getElementById('buttons');
        letters = document.createElement('ul');
            

        


      for (var i = 0; i < alphabet.length; i++) {
        letters.id = 'alphabet';
        list = document.createElement('li');

        list.id = 'letter';
        list.innerHTML = alphabet[i];

        check();

        

        myButtons.appendChild(letters);
        letters.appendChild(list);
      }
    }

    var selectCat = function () {
        if (chosenCategory === categories[0]) {
          categoryName.innerHTML = "";
        }
      }
    
    // Create guesses ul
     result = function () {
        wordHolder = document.getElementById('hold');
        correct = document.createElement('ul');

        for (var i = 0; i < word.length; i++) {
            correct.setAttribute('id', 'my-word');
            guess = document.createElement('li');
            guess.setAttribute('class', 'guess');

            if (word[i] === "-") {
                guess.innerHTML = "-";
                space = 1;
            } else {
                guess.innerHTML = "_";
            }

            guesses.push(guess);
            wordHolder.appendChild(correct);
            correct.appendChild(guess);
        }
    }
    
    // show lives
     comments = function () {
        showLives.innerHTML = "You have " + lives + " lives";
        if (lives < 1) {
            showLives.innerHTML = "Game Over";
        }
        for (var i = 0; i < guesses.length; i++) {
            if (counter + space === guesses.length) {
                showLives.innerHTML = "You Win!";
            }
        }
    }
    
    // animate man
    var animate = function () {
        var drawMe = lives ;
        drawArray[drawMe]();
    }
    
    
    // hangman
    canvas =  function(){

        myStickman = document.getElementById("stickman");
        context = myStickman.getContext('2d');
        context.beginPath();
        context.strokeStyle = "#fff";
        context.lineWidth = 2;
    };
      
    head = function(){
        myStickman = document.getElementById("stickman");
        context = myStickman.getContext('2d');
        context.beginPath();
        context.arc(60, 25, 10, 0, Math.PI*2, true);
        context.stroke();
    }
      
    draw = function($pathFromx, $pathFromy, $pathTox, $pathToy) {
        context.moveTo($pathFromx, $pathFromy);
        context.lineTo($pathTox, $pathToy);
        context.stroke(); 
    }
    
    frame1 = function() { draw (0, 150, 150, 150); };
    
    frame2 = function() { draw (10, 0, 10, 600); };

    frame3 = function() { draw (0, 5, 70, 5); };

    frame4 = function() { draw (60, 5, 60, 15); };

    torso = function() { draw (60, 36, 60, 70); };

    rightArm = function() { draw (60, 46, 100, 50); };

    leftArm = function() { draw (60, 46, 20, 50); };

    rightLeg = function() { draw (60, 70, 100, 100); };

    leftLeg = function() { draw (60, 70, 20, 100); };
    
    drawArray = [rightLeg, leftLeg, rightArm, leftArm,  torso,  head, frame4, frame3, frame2, frame1]; 
    
    
    // OnClick Function
     check = function () {
        list.onclick = function () {
            this.style.backgroundColor = 'rgba(218, 218, 218, 0.774)';
            this.style.borderColor = 'rgba(218, 218, 218, 0.774)';

            var guess = (this.innerHTML);
            this.setAttribute("class", "active");
            this.onclick = null;

            for (var i = 0; i < word.length; i++) {
                if (word[i] === guess) {
                    guesses[i].innerHTML = guess;
                    counter += 1;

                }
                
            }
            
            var j = (word.indexOf(guess));
            if (j === -1) {
                lives -= 1;
                comments();
                animate();
            } 
            else {
                comments();
            }
        }
    }
    
    // play
    play = function () {
        categories = [
            ["mitosis", "prokaryote", "transcription", "in vitro", "ribosome", "endonuclease", "chromosome", "primosome", "biomarkers", "polymerase",
            "antibiotic", "antigen", "biosynthesis", "catalyst", "chlorophyll", "chloroplast", "homeostasis", "hydrophobic", "lysosome", "meiosis",
            "mutation", "osmosis", "pipette" , "nucleus"]
        ];

        chosenCategory = categories[Math.floor(Math.random() * categories.length)];
        word = chosenCategory[Math.floor(Math.random() * chosenCategory.length)];
        word = word.replace(/\s/g, "-");
        console.log(word);
        buttons();

        guesses = [ ];
        lives = 10;
        counter = 0;
        space = 0;
        result();
        comments();
        selectCat();
        canvas();
    }
    
    play();
    
    // hint
    
    hint.onclick = function() {
    
        hints = [
          ["Cell division.", 
           "Unicellular organism that lacks a nuclear membrane-enclosed nucleus.", 
           "The process of making an RNA copy of a gene sequence.", 
           "Performed or taking place in a test tube", 
           "Factory for protein synthesis in cells.", 
           "An enzyme that breaks down a nucleotide chain into two or more shorter chains.", 
           "Long DNA molecule with part or all of the genetic material of an organism.",
           "A protein complex responsible for creating RNA primers.",
           "Biological molecule found in blood.",
           "Enzymes that catalyze the synthesis of DNA or RNA polymers.",
           "A substance used to kill microorganisms and cure infections.",
           "Any substance that stimulates an immune response in the body.",
           "Production of a chemical compound by a living organism.",
           "Substance that initiates or accelerates a chemical reaction.",
           "Any of green pigments found in photosynthetic organisms.",
           "Organelle in which photosynthesis takes place.",
           "Metabolic equilibrium maintained by biological mechanisms.",
           "Lacking affinity for water.",
           "A membrane-bound organelle containing digestive enzymes.",
           "Cell division that produces reproductive cells.",
           "A change or alteration in form or qualities.",
           "Diffusion of molecules through a semipermeable membrane.",
           "Laboratory instrument used to measure out or transfer small quantities of liquid.",
           "Controls and regulates the activities of the cell.",]

      ];
    
        var categoryIndex = categories.indexOf(chosenCategory);
        var hintIndex = chosenCategory.indexOf(word);
        showClue.innerHTML = "Clue: " +  hints [categoryIndex][hintIndex];
    };
    
    
    // reset
    
    document.getElementById('reset').onclick = function() {

        correct.parentNode.removeChild(correct);
        letters.parentNode.removeChild(letters);
        showClue.innerHTML = "";
        context.clearRect(0, 0, 400, 400);
        play();
    }
}
    