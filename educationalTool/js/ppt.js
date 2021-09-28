

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