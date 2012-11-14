var iAnticipateThat = require('../lib/index');
var format = require('../lib/format');

iAnticipateThat(format, {
  'Formats various types for output': [
    { in: 5, out: 5 },
    { in: true, out: true },
    { in: 'Hello', out: "'Hello'" },
    { in: {}, out: '{}' },
    { in: new Error('Message'), out: "'Error: Message'" },
    { in: { name: 'Error', message: 'Message' }, out: "'Error: Message'" },
  ],
  'Can format more complex data for output': [
    { in: [[1,2,3]], out: "[1,2,3]" },
    { in: [[[1],2,3]], out: "[[1],2,3]" },
    { in: [function() {}], out: "'function'" },
    { in: [[function() {}]], out: '["function"]' },
    { in: [[function() {},function() {}]], out: '["function","function"]' }
  ]
});