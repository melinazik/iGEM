$(function () { // wait for document ready
    var h = window.innerHeight
    var w = window.innerWidth
    const fw = -60;
    const curvy = 1.8

   
    ts = ['#t1', '#t2', '#t3', '#t4', '#t5','#t7','#t8', '#t6']
    imgs = ['.turtle', '.firesvg', '.gasolin','.chlammybottlesvg', ".homefig", ".homefig2", ".homefig3", '.recyclingsvg']
    // setup positions n stuff
    TweenLite.set('#an', {
        x: w  - fw - $('#bgvid').width()/3
    });
    TweenLite.set('#an', {
        y: 1300
    });
    TweenLite.set('#an', {
        display: "block"
    });
    TweenLite.set('#flasch2', {
        display: "block"
    });
    TweenLite.set('.turtle', {
        x: w / 2 + 100,
        y: 2000
    });
    TweenLite.set('.turtle', {
        display: "block"
    });
    TweenLite.set('.firesvg', {
        x: 120,
        y: 3700
    });
    TweenLite.set('.firesvg', {
        display: "block"
    });
    TweenLite.set('.gasolin', {
        x: w / 2 + 150,
        y: 5700
    });
    TweenLite.set('.gasolin', {
        display: "block"
    });
    TweenLite.set('.chlammybottlesvg', {
        x: 300,
        y: 8200
    });
    TweenLite.set('.chlammybottlesvg', {
        display: "block"
    });
    TweenLite.set('.recyclingsvg', {
        x: w / 2 -100,
        y: 10000
    });
    TweenLite.set('.recyclingsvg', {
        display: "block"
    });
    TweenLite.set('.homefig', {
        display: "block"
    });

    var posSpacer = 2200
    var curPos = 750
    ts.forEach(t => {
        TweenLite.set(t, {
            y: curPos +270
        })
        TweenLite.set(t, {
            display: "block"
        })
        curPos += posSpacer
    });

    var posSpacer = 2200
    var curPos = 2950
    imgs.forEach(t => {
        TweenLite.set(t, {
            x: w/2,
            y: curPos -$(t).height()/1
        })
        TweenLite.set(t, {
            display: "block"
        })
        curPos += posSpacer
    });
    TweenLite.set('.homefig', {
        x: w / 2 -200,
    });
    TweenLite.set('.homefig3', {
        x: w / 2 -200,
    });

    var values = genVals(curPos, w, fw);
    var flightpath = {
        entry: {
            curviness: curvy,
            autoRotate: -90,
            values: values
        }
    };
    var data = BezierPlugin.bezierThrough(values, curvy);
    var d = "M" + data.x[0].a + "," + data.y[0].a + " C" + segmentToString(data.x[0], data.y[0]); //the <path> data
    for (var i = 1; i < data.x.length; i++) {
        d += "," + segmentToString(data.x[i], data.y[i]);
    }
    genFall(curPos,d);
    // init controller
    var controller = new ScrollMagic.Controller();

    // create tween
    var headlinet = new TimelineMax()
        .add(TweenMax.to($(".big-text"), 0, {
            opacity: 1
        }))
        .add(TweenMax.to($('.big-text'), 1, {
            css: {
                opacity: 0
            },
            ease: Power1.easeInOut
        }))
    var quote = new TimelineMax()
        .add(TweenMax.to($(".quote-text"), 0, {
            opacity: 0.7
        }))
        .add(TweenMax.to($('.quote-text'), 1, {
            css: {
                opacity: 0
            },
            ease: Power1.easeInOut
        }))
    var flasche1 = new TimelineMax()
        .add(TweenMax.to($("#an"), 0, {
            x: w  - fw - 100,
            y: 0
        }))
        .add(TweenMax.to($("#an"), 1, {
            css: {
                bezier: flightpath.entry
            },
            ease: Power0.easeIn
        }))
    var flasche2 = new TimelineMax()
        .add(TweenMax.to($("#flasch2"), 0, {
            x: w  - fw - 100,
            y: 0
        }))
        .add(TweenMax.to($("#flasch2"), 1, {
            css: {
                bezier: flightpath.entry
            },
            ease: Power0.easeIn
        }))
    var flaschein = new TimelineMax()
        .add(TweenMax.to($("#an"), 0, {
           opacity:0
        }))
        .add(TweenMax.to($("#an"), 1, {
           opacity:1
        }))
    var flascheout = new TimelineMax()
    .add(TweenMax.to($("#an"), 0, {
       opacity:1
    }))
    .add(TweenMax.to($("#an"), 1, {
       opacity:0
    }))
    var flasche2in = new TimelineMax()
    .add(TweenMax.to($("#flasch2"), 0, {
       opacity:0
    }))
    .add(TweenMax.to($("#flasch2"), 1, {
       opacity:1
    }))

    TweenLite.set('#an', {
        opacity: 0
    });

    const finDuration = 200;
    const inDuration = 400;
    const pinDuration = 700;
    const spacing = 800;
    var cur = 1400;
    var headline = new ScrollMagic.Scene({
            triggerElement: "#trigger",
            duration: 500,
            offset: 300
        })
        .setTween(headlinet)
        .addTo(controller);

    var quotet = new ScrollMagic.Scene({
            triggerElement: "#trigger",
            duration: 500,
            offset: 500
        })
        .setTween(quote)
        .addTo(controller);
    var flasche = new ScrollMagic.Scene({
            triggerElement: "#trigger",
            duration: curPos-h*1.5,
            offset: 800
        })
        .setTween(flasche1)
        .addTo(controller);
    var flasche = new ScrollMagic.Scene({
            triggerElement: "#trigger",
            duration: curPos-h*1.5,
            offset: 800
        })
        .setTween(flasche2)
        .addTo(controller);
    var flasche = new ScrollMagic.Scene({
            triggerElement: "#trigger",
            duration: h*2,
            offset: curPos-h*2
        })
        .setTween(flascheout)
        .addTo(controller);
    var flasche = new ScrollMagic.Scene({
            triggerElement: "#trigger",
            duration: h*2,
            offset: curPos-h*2
        })
        .setTween(flasche2in)
        .addTo(controller);
        var flasche = new ScrollMagic.Scene({
            triggerElement: "#trigger",
            duration: 600,
            offset: 1200
        })
        .setTween(flaschein)
        .addTo(controller);

    for (var i = 0; i < ts.length; i++) {
        cur += finDuration
        cur += inDuration
        cur += pinDuration + spacing
    }
    $('.content-home').height(curPos);
    window.onscroll = function () {
        window.scrollTo(0, 0);
    };
    setTimeout(
        function myHandler(e) {
            window.onscroll = function () {};
        }, 1500)
})
var genVals = (size, w, fw) => {
    res = []
    res.push({
        x: w/2  + $('#bgvid').width()/2,
        y: 750
    })
    space = 1100
    offset = 1500
    for (var i = offset; i < size; i += space) {
        var a = (w/3);
        var b = (i-offset) % (2*space) == 0 ? 1 : -1;
        var x = ( a*b )
        res.push({
            x: w / 2 + fw + x,
            y: i
        })
    }
    res.pop()
    res.push({
        x: w / 2 +150,
        y: size-$("#an").height()*1.5-150
    })
    return res
}
var genFall = (size,d) => {
    var h = window.innerHeight
    var w = window.innerWidth
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    
    svg.setAttribute("aria-hidden","true");
    svg.setAttribute('viewbox', '0 0 '+w+" "+size);
    svg.setAttribute('width', w);
    svg.setAttribute('height', size+100+"px");

    
    path.setAttribute('d', d);
    path.setAttribute('stroke-width',5);
    path.setAttribute('stroke','white');
    path.setAttribute('fill','none');
    path.setAttribute('class','svgline');
    svg.setAttribute('class','svglinecontainer');

    
    svg.appendChild(path);

    document.body.appendChild(svg);
    var x = document.getElementsByClassName("body")
    x[0].appendChild(svg)
    TweenLite.set('.svglinecontainer', {
        top: $("#an").height()+30,
        left: $("#an").width()/2,
    });
}
function segmentToString(x, y) {
  return [x.b.toFixed(2), y.b.toFixed(2), x.c.toFixed(2), y.c.toFixed(2), x.d.toFixed(2), y.d.toFixed(2)].join(",");
}