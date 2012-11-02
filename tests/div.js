var test = require('../lib/index');

var div = function (first, second) {
  return first / second;
};

test(div, {
  'I want to divide numbers': [
    { in : [ 17, 2 ], out : 8.5 },
    { in : [ 27, 9 ], out : 3 }
  ]
});