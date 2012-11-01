var _ = require('underscore');

var functionUnderTest = function () {
  return 4;
};

var unanticipated = function (reason, actual, anticipated) {
  console.error('%s: Anticipated \'%s\' instead of \'%s\'.', reason, anticipated, actual);
}; 

var verify = function (functionUnderTest, reason, intent) {
  var input = intent.in,
      anticipated = intent.out;

  var actual = functionUnderTest(input);

  if (actual !== anticipated) {
    unanticipated(reason, actual, anticipated);
  } 
};

var test = function (functionUnderTest, intents) {
  _.each(intents, function (intent, reason) { 
    verify(functionUnderTest, reason, intent); 
  });
};

test(functionUnderTest, {
  'I convey intent': { in : 0, out : 5 }
});


/*

7. Put in an else clause that show that the test was successfull
9. Implement more than one thing in one intent. 
10. And also more than one intent. 
11. Errors
12. Callbacks
13. More than one In.
6. Eventuell Set einführen
*/