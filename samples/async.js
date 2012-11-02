var test = require('../lib/index');

function addAsync (first, second, callback) {
  var sum = first + second;
  var result = callback(sum);
  return result + 1;
}

test(addAsync, {
  'Stub': { in: [ 2, 3, function () { return 23; } ], out: 24 },
  'Mock': { in: [ 2, 3, function (sum) { if(sum !== 5) throw new Error('sum is wrong'); return 23; } ], out: 24 }
});