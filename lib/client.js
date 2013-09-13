/*global window, document, require, console*/
var part1 = require('./part1.js'),
    part2 = require('./part2.js'),
    Backbone = require('backbone'),
    wait = window.setInterval(function () {
        'use strict';
        if ((document.hasOwnProperty('body') === true) && (typeof document.body === "object") && (typeof document.body.appendChild === 'function')) {
            window.clearInterval(wait);
            part1.start();
            window.setTimeout(function () {
                part1.clear();
                part2();
            }, 4000);
        }
    });
