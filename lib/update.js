/*global window, document, require, console*/
var $ = require('jquery-browserify'),
	_ = require('underscore'),
	Backbone = require('backbone');	
module.exports = (function () {
	var cur_json = {Airlines: []},
		route,
		N,
		get_json = function () {
			$.ajax({
				url: 'http://api.anywayanyday.com/api/NewRequest/?Route=' + route + '&AD=1&CN=0&CS=E&Partner=testapic&_Serialize=JSON',
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
							if ((compl.state === false) && (compl.time < 20000)) {
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
												update(json);
												setTimeout(function () {
													window.clearTimeout(i);
													get_json();
												}, 60000 / N);
											} else {
												window.clearTimeout(i);
												get_json();
											}
										});
									}
								});
							} else {
								console.log('Completed in ' + Math.floor(compl.time / 1000) + ' sec.');
								window.clearTimeout(i);
								get_json();
							}
						}, 50);
				}
			});
		},
		update = function (json) {
			if (cur_json !== json) {
				//update Backbone collections
				var cur_al = cur_json.Airlines.map(function (a) {return a.Name;}),
					al = json.Airlines.map(function (a) {return a.Name;}),
					add_airlines = _.difference(al, cur_al);
					del_airlines = _.without(cur_al, al);
				console.log('add:');
				console.dir(add_airlines);
				console.log('del:');
				console.dir(del_airlines);
				//	del_airlines = _.
				//json.Airlines.forEach(function (al) {
				//	if (cur_json.Airlines.indexOf(al) !== -1) {
				//	}
				//});
				//var M = Backbone.Model.extend({}),
				//	Al = Backbone.Collection.extend({
				//		model: M
				//	}),
				//al = new Al();
				//al.add(json.Airlines.map(function (a) {return a.Name;}));
				cur_json = json;
			}
		};
	return {
		start: get_json,
		route: function (a) {
			if (a !== undefined) {
				route = a;
			}
			return route;
		},
		interval: function (a) {
			if (a !== undefined) {
				N = a;
			}
			return N;
		}
	};
}());
