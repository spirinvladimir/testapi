/*global require*/
var http = require('http'),
    UglifyJS = require('uglify-js'),
    browserify = require('browserify'),
    b = browserify();
b.add('./lib/client.js').bundle({}, function (err, src) {
	'use strict';
    src = UglifyJS.minify(src.toString(), {fromString: true});
    var server = http.createServer(function (req, res) {
		res.writeHead(200);
        res.end('<script>' + src.code + '</script>');
	}),
       port = process.env.VCAP_SERVICES || Math.floor(Math.random() * 8080);
    console.log('http://localhost:' + port + '/');
	server.listen(port);
});
