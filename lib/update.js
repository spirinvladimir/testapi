/*global window, document, require, console*/
var $ = require('jquery-browserify'),
	_ = require('underscore'),
	folder = require('./folder');	
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
								window.clearTimeout(i);
								get_json();
							}
						}, 50);
				}
			});
		},
		update = function (json) {
			if (cur_json !== json) {
				var cur_names = cur_json.Airlines.map(function (a) {return a.Name;}),
					new_names = json.Airlines.map(function (a) {return a.Name;}),
					add = _.difference(new_names, cur_names),
					del = _.without(cur_names, new_names);				
				folder.Airlines.add(add);
				folder.Airlines.del(del);
				cur_json.Airlines.forEach(function (a) {
					json.Airlines.forEach(function (b) {
						if (a.Name === b.Name) {
							var aff = {
								FaresId: a.FaresFull.FaresId,
								TotalAmount: a.FaresFull.TotalAmount,
								Currency: a.FaresFull.Currency
							},
								bff = {
									FaresId: b.FaresFull.FaresId,
									TotalAmount: b.FaresFull.TotalAmount,
									Currency: b.FaresFull.Currency
								};
							if (aff !== bff) {
								folder.Fares.reset(a.Name, bff);
							}
						}
					});
				});
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
