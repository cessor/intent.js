var test = require('../lib/index');

function addAsync (first, second, callback) {
  var sum = first + second;
  var result = callback(sum);
  return result + 1;
}

test(addAsync, {
  'Adds numbers': { in: [ 2, 3, test.callback({ in: 5, out: 23 }) ], out: 24 },
  'Callback throws error': { in: [ 2, 3, test.callback({ in: 5, error: new Error('foo') }) ], error: { message: 'foo' } }
});