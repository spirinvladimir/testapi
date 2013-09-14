/*global window, document, require, console*/
var $ = require('jquery-browserify'),
	folder = require('./folder.js'),
	update = require('./update.js'),
	Backbone = require('backbone');
module.exports = function () {
	'use strict';
	var N = 3;
	update.interval(N);
	update.route('2406MOWLON');
	update.start();
};
