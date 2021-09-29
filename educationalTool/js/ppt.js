

// When the user clicks the button, open the modal 
function openPPT() {
    // Get the modal
    var modal = document.getElementById("myModal");
                
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "block";
}


// When the user clicks on <span> (x), close the modal
 function closePPT(){
     // Get the modal
    var modal = document.getElementById("myModal");
                
    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    modal.style.display = "none";
}

function openPPT1() {
    var modal = document.getElementById("myModal1");
    modal.style.display = "block";
}

function openPPT2() {
    var modal = document.getElementById("myModal2");
    modal.style.display = "block";
}

function closePPT1(){
   var modal = document.getElementById("myModal1");
   modal.style.display = "none";
}

function closePPT2(){
    var modal = document.getElementById("myModal2");
    modal.style.display = "none";
 }