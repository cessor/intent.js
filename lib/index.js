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
    return false;
  }
  return true; 
};

var verifyAll = function (functionUnderTest, intents) {
  var fulfilled = _.map(intents, function (intent, reason) { 
    return verify(functionUnderTest, reason, intent); 
  });

  return _.all(fulfilled);
};

var test = function (functionUnderTest, intents) {
  var everythingIsFine = verifyAll(functionUnderTest, intents);

  if (everythingIsFine) {
    console.log("DEINE MUDDER!!!!");
  }
};

test(functionUnderTest, {
  'I convey intent': { in : 0, out : 2 }
});


/*
-- There is not much use in us printing dots for running tests because they dont actually tell us anything... 

7. Put in an else clause that show that the test was successfull
9. Implement more than one thing in one intent. 
10. And also more than one intent. 
11. Errors
12. Callbacks
13. More than one In.
6. Eventuell Set einführen

14. Add inspirational info for successful test runs, so that our users will be happy :) 
Everything is fine, <...> 
Start Something!
Advance!
Improve!
Learn!
Iterate!

15. ETA -  Calculate the Estimated Time! 
*/