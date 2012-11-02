var test = require('../lib/index');

test(function () { throw new Error('Fehler'); }, {
  'Should not throw exception': {}
});