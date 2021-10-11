window.addEventListener('scroll', function() {
    let l = Path_440.getTotalLength();
    let dasharray = l;
    let dashoffset = l;
    e = document.documentElement;
    theFill.setAttributeNS(null, "stroke-dasharray", l);
    theFill.setAttributeNS(null, "stroke-dashoffset", l);
    dashoffset = l - window.scrollY * l / (e.scrollHeight - e.clientHeight);
    console.log('window.scrollY', window.scrollY, 'scrollTop', e.scrollTop, 'scrollHeight', e.scrollHeight, 'clientHeight', e.clientHeight, 'dash-offset', dashoffset);
    theFill.setAttributeNS(null, "stroke-dashoffset", dashoffset);
    })

    window.onscroll = function () { scrollSvgFill() };
