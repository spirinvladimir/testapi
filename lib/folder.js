/*global window, document, require, console */
var zoom = function () {
    'use strict';
    //move(this.id).scale(3).end();
};

var make = function (id, w, h, left, top) {
    'use strict';
    var el = document.createElement('div');
    el.setAttribute('id', id);
    //el.style.backgroundColor = 'green';
    el.style.border = '1px solid #888';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.position = 'absolute';
    el.innerHTML = 'box ' + id;
    el.addEventListener('mouseover', zoom, false);
    document.body.appendChild(el);
};

module.export = function () {
    'use strict';
    var n = 25,
        i,
        w = 0.9 * document.body.clientWidth,
        h = 0.9 * document.body.clientHeight,
        box_sq = (w * h) / n,
        box_h = Math.sqrt(box_sq * h / w),
        box_w = box_sq / box_h,
        tox = 0,
        toy = 0,
        x = [];
    document.body.style.position = 'relative';
    for (i = 0; i < n; i = i + 1) {
        x.push(i);
    }
    x.forEach(function (i) {
        setTimeout(function () {
            make(i, box_w, box_h, 0, 0);
            //move(i + '')
            //  .x(tox)
            //  .y(toy)
            //  .ease('in-out')
            //  .duration(2)
            //  .rotate(360)
            //  .end();
            tox = (tox + box_w) % w;
            if (Math.round(tox) === 0) {
                toy = (toy + box_h) % h;
            }
        }, i * 100);
    });
};

