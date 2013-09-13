/*global window, document, require, console*/
var $ = require('jquery-browserify'),
	folder = require('./folder.js');
module.exports = function () {
	'use strict';
	$.ajax({
		url: 'http://api.anywayanyday.com/api/NewRequest/?Route=2406MOWLON&AD=1&CN=0&CS=E&Partner=testapic&_Serialize=JSON',
		dataType: 'jsonp'
	}).done(function (json) {
		if (json.hasOwnProperty('Id') === true) {
			var Id = json.Id,
				compl = {
					state: false,
					start: (new Date()).getTime()
				},
				i = setInterval(function () {
					compl.time = (new Date()).getTime() - compl.start;
					if ((compl.state === false) && (compl.time < 10000)) {
						$.ajax({
							url: 'http://api.anywayanyday.com/api/RequestState/?R=' + Id + '&_Serialize=JSON',
							dataType: 'jsonp'
						}).done(function (json) {
							if ((compl.state === false) && (json.hasOwnProperty('Completed') === true) && (json.Completed === '100')) {
								compl.state = true;
								$.ajax({
									url: 'http://api.anywayanyday.com/api/Fares/?R=' + Id + '&V=Matrix&VB=true&L=ru&_Serialize=JSON',
									dataType: 'jsonp'
								}).done(function (json) {
									if (json.Error === null) {
										var M = Backbone.Model.extend({}),
                    						Al = Backbone.Collection.extend({
                        						model: M
                    						}),
                    					al = new Al();
                						al.add(json.Airlines.map(function (a) {return a.Name;}));
										console.dir(json);
									}
								});
							}
						});
					} else {
						console.log('Completed in ' + Math.floor(compl.time / 1000) + ' sec.');
						window.clearTimeout(i);
					}
				}, 50);
		}
	});
};
