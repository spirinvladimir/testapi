/*global window, document, require, console*/
var contaner = document.createElement('c'),
    c1 = document.createElement('c1'),
    c2 = document.createElement('c2'),
    c3 = document.createElement('c3'),
    setLetter = function (c) {
        'use strict';
        var alf = ['*', '-', '+'];
        c.innerHTML += alf[Math.floor(Math.random() * alf.length)];
        c.innerHTML += alf[Math.floor(Math.random() * alf.length)];
        c.innerHTML += alf[Math.floor(Math.random() * alf.length)];
    },
    setLetter1 = function () {'use strict'; setLetter(c1); },
    setLetter2 = function () {'use strict'; setLetter(c2); },
    setLetter3 = function () {'use strict'; setLetter(c3); },
    resize = function () {
        'use strict';
        var per = 30,
            w = {};
        w.body = document.body.clientWidth;
        w.c1 = 100;
        w.c2 = (w.body - w.c1) * (1 - per / 100);
        w.c3 = (w.body - w.c1) * (per / 100);
        c1.style.left = '0px';
        c1.style.width = w.c1 + 'px';
        c2.style.left = w.c1 + 'px';
        c2.style.width = w.c2 + 'px';
        c3.style.left = w.c1 + w.c2 + 'px';
        c3.style.width = w.c3 + 'px';
    };
contaner.appendChild(c1);
contaner.appendChild(c2);
contaner.appendChild(c3);
contaner.style.position = 'relative';
c1.style.position = 'absolute';
c1.style.color = 'green';
c2.style.position = 'absolute';
c3.style.position = 'absolute';
c3.style.color = 'green';

module.exports = {
    start: function () {
        'use strict';
        document.body.appendChild(contaner);
        window.setInterval(setLetter1, 200);
        window.setInterval(setLetter2, 80);
        window.setInterval(setLetter3, 100);
        resize();
        window.onresize = resize;
    },
    clear: function () {
        contaner.removeChild(c1);
        contaner.removeChild(c2);
        contaner.removeChild(c3);
        document.body.removeChild(contaner);    
    }
};
