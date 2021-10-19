/* NavBar Script */

var textSection = null;
var navbar = document.getElementById("navbar");

window.addEventListener('load', function () {
    textSection = document.querySelector('.elevate-navbar');
    checkScrollPos();
    checkBackToTopPos();
})
window.addEventListener('scroll', function () {
    updateScrollbar();
    checkNavbarPos();
    checkScrollPos();
    checkBackToTopPos();
});

function checkScrollPos() {
    var footerTop = document.getElementById("footerWrapper").getBoundingClientRect().top;
    var scrollbarBottom = document.getElementById("scrollbar-container").getBoundingClientRect().bottom;
    let scrollWrapper = document.querySelector('.scroll-wrapper');
    if (scrollbarBottom >= footerTop) {
        if (scrollWrapper.getAttribute("hiddenScroll") == "false") scrollWrapper.setAttribute("hiddenScroll",
            "true");
    } else {
        if (scrollWrapper.getAttribute("hiddenScroll") == "true") scrollWrapper.setAttribute("hiddenScroll",
            "false");
    }
}

function checkBackToTopPos() {
    if ($(window).scrollTop() > 1000) {
        $('#backtotop-wrapper').addClass('scrolled')
    } else $('#backtotop-wrapper').removeClass('scrolled')
}
$(document).ready(function () {
    $('#backtotop-wrapper').on('click', function () {
        $('html, body').animate({
            'scrollTop': $('body').offset().top
        }, 2000);
    });
});

function updateScrollbar() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("scrollbar").style.height = scrolled + "%";
}

var scroll = new SmoothScroll('a[href*="#"]', {
    speed: 400,
    speedAsDuration: true,
    offset: 160
});

document.getElementById("fixedOverlay").classList.add("project");


/* back to top button */
var mybutton = document.getElementById("BacktoTop");

window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function changeColor(x) {
    x.style.background = '#5893D4';
    x.style.color = '#002060';
}

function normalColor(x) {
    x.style.background = '#B7E0FF';
}