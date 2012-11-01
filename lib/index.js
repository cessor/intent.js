var _ = require('underscore');

var functionUnderTest = function () {
  return 4;
};

var unanticipated = function (reason, actual, anticipated) {
  console.error('%s: Anticipated \'%s\' instead of \'%s\'.', reason, anticipated, actual);
}; 

var anticipateThat = function (everythingIsFine) {
  if(everythingIsFine) {
    console.log('Everything is fine, go watch a movie!');
  }
};

var verify = function (functionUnderTest, reason, intent) {
  var input = intent.in,
      anticipated = intent.out;

  var actual = functionUnderTest(input);

  if (actual !== anticipated) {
    unanticipated(reason, actual, anticipated);
    return false;
  }

  // There is not much use in printing a dot for a successful test because it doesn't actually tell us anything ... - Golo and Johannes, 11/1/2012
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
  
  anticipateThat(everythingIsFine);  
};

test(functionUnderTest, {
  'I convey intent': { in : 0, out : 4 }
});


/*

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