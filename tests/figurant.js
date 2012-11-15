var iAnticipateThat = require('../lib/index');
var compare = require('compare.js');
var _ = require('underscore');
var format = require('../lib/format');
var util = require('util');

var give = function (value) {
	var fn = function () {
		return value;
	};
	return fn;
}

var take = function () {
	var anticipated = _.flatten(arguments);
	return function () { 
		var actual = _.flatten(arguments);
		if(compare.eq(actual, anticipated)) {
			return;
		}
		throw new Error(util.format('Took %s instead of %s.', format(anticipated), format(actual))); // JH, 12.11.2012 - This should actually use the 'unanticipated' function from the mothership (the index module)
	};
};

module.exports = { 'give' : give, 'take' : take };

var right = 5;
var wrong = 10;
var thisIsWhatIWant = 5;

var callWithRightInput = function (fn) { fn(right); };
var callWithWrongInput = function (fn) { fn(wrong); };

var callIt = function (fn) { return fn(); };
var anyFunction = function() { return function() { }; };

iAnticipateThat(give, { 'gives me a function, that returns the input of give' : { in: 5, out: anyFunction }});
iAnticipateThat(callIt, { 'gives me what I put in as indirect input' : { in: give(5), out: 5 }});
iAnticipateThat(callWithRightInput, { 'makes the take function happy.': { in: take(thisIsWhatIWant) }});
iAnticipateThat(callWithWrongInput, { 'makes the take function unhappy.': { in: take(thisIsWhatIWant), error: { message: 'Took [5] instead of [10]' }}});