'use strict';

define(function (require) {
	let registerSuite = require('intern!object');
	let assert = require('intern/chai!assert');

	function example(console) {
		// <code>
		let l = 1,
		    r = 2

		let result = l + r;

		// </code>
		console.log(result);
		console.log(result);

		// <expected>
		// 3
		// 3
		// </expected>
	}

	let ConsoleInterceptor = function() {
		this.lines = [];
	};
	ConsoleInterceptor.prototype.log = function(line) {
		this.lines.push(line);
	};

	registerSuite({
		'passing test': function() {
			assert.equal(1, 1);
		},

		'example test': function () {

			var consoleInterceptor = new ConsoleInterceptor();
			example(consoleInterceptor);

			let functionAsString = example.toString();
			let codeRegexp = /\/\/\s*<code>\s*\n((.|\s)*)\n\s*\/\/\s*<\/code>/m;
			let expectedRegexp = /\/\/\s*<expected>\n((.|\s)*)\n\s*\/\/\s*<\/expected>/m;

			let code = codeRegexp.exec(functionAsString)[1];
			let expected = expectedRegexp.exec(functionAsString)[1];

			var expectedLines = expected.split('//').splice(1);

			expectedLines = expectedLines.map(function (line) {
				return line.trim();
			});

			assert.equal(consoleInterceptor.lines.length, expectedLines.length);
			consoleInterceptor.lines.forEach(function (actual, idx) {
				assert.equal(actual.toString(), expectedLines[idx]);
			});

		}
	});
});