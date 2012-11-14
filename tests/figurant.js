var iAnticipateThat = require('../lib/index');
var compare = require('compare.js');
var util = require('util');

var give = function (value) {
	var fn = function () {
		return value;
	};
	return fn;
}

var logArgs = function (args) {
	for(var a in args){
		console.log('\t' + args[a]);
	}
};

var take = function () {
	var anticipatedInput = arguments;
	console.log('outer args: ');
	logArgs(anticipatedInput);
	return function () { 
		var ai = arguments;
		console.log('inner args: ');
		logArgs(ai);
		if(ai !== anticipatedInput) {
			// JH, 12.11.2012 - This should actually use the 'unanticipated' function from the mothership (the index module)
			throw new Error(util.format('Did not take %s', anticipatedInput));
		}
	};
};

module.exports = { 'give' : give, 'take' : take };

var right = 5;
var wrong = 10;
var thisIsWhatIWant = 5;

var callWithWrongInput = function (fn) {
	fn(wrong);
}; 

var callWithRightInput = function (fn) {
	fn(right);
}; 

var callIt = function (fn) {
	return fn();
};

iAnticipateThat(callIt, {
	'gives me what I put in as indirect input' : {in: give(5), out: 5}
});

iAnticipateThat(callWithRightInput, { 
	'makes the take function happy.': { in: take(thisIsWhatIWant) }
});  	

iAnticipateThat(callWithWrongInput, { 
	'makes the take function unhappy.': { in: take(thisIsWhatIWant), error: { message: 'Did not take 5' } }
});

console.log('compare');
iAnticipateThat(compare.eqs, {
	'can compare two arrays in a sequence' : [
		{ in: [[1,2,3],[1,2,3]], out:true },
		{ in: [{m:5},{m:5}], out:true }
	]
});