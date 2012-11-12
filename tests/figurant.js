var iAnticipateThat = require('../lib/index');

var hot = 40;
var cold = 10;
var roomTemperature = 21;

var thermometer = function (currentTemperature, desiredTemperature) {
	return (currentTemperature >= desiredTemperature);
};

var give = function (value) {
	var fn = function () {
		return value;
	};
	return fn;
}

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
