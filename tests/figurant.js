var iAnticipateThat = require('../lib/index');
var util = require('util');

var hot = 40;
var cold = 10;
var roomTemperature = 21;

module.exports 

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


// JH, 12.11.2012 - Move this to the samples, for it illustrates how to use the figurant module. This should stay separate and I really like the name!


var thermometer = function (currentTemperature, desiredTemperature) {
	return (currentTemperature >= desiredTemperature);
};

var thermostat = function (desiredTemperature, sensor, thermometer) {
	var temperature = sensor();
	if(temperature === desiredTemperature) {
		return 0;
	}
	if(thermometer(temperature, desiredTemperature)) {
		return -1;
	}
	return 1;
};




iAnticipateThat(thermometer, {
	'tells me whether something is hot' : { in: [hot, roomTemperature], out: true },
	'tells me whether something is cold' : { in: [cold, roomTemperature], out: false }
});

iAnticipateThat(thermostat, {
	'should increase temperature if it is cold.' : { in: [roomTemperature, give(cold), thermometer], out: 1 },
	'should decrease temperature if it is hot.' : { in: [roomTemperature, give(hot), thermometer], out: -1 },
	'should not do anything if temperature ok.' : { in: [roomTemperature, give(roomTemperature), thermometer], out: 0},
});



