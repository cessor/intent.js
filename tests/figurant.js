var iAnticipateThat = require('../lib/index');
var util = require('util');

var give = function (value) {
	var fn = function () {
		return value;
	};
	return fn;
}

var receive = function (anticipatedInput) {
	return function (argument) { 
		if(argument !== anticipatedInput) {
			// JH, 12.11.2012 - This should actually use the 'unanticipated' function from the mothership (the index module)
			throw new Error(util.format('Did not receive %s', anticipatedInput));
		}
	};
};

module.exports = { 'give' : give, 'receive' : receive };

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
	'makes the receive function happy.': { in: receive(thisIsWhatIWant) }
});  	

iAnticipateThat(callWithWrongInput, { 
	'makes the receive function unhappy.': { in: receive(thisIsWhatIWant), error: { message: 'Did not receive 5' } }
});