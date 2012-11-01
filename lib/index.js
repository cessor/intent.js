var _ = require('underscore');

var functionUnderTest = function () {
  return 4;
};

var unanticipated = function (reason, actual, anticipated) {
  console.error('%s: Anticipated \'%s\' instead of \'%s\'.', reason, anticipated, actual);
}; 

var inspirations = [
  'advance',
  'improve',
  'iterate',
  'learn',
  'start something',
  'refactor'
]; 

var random = function (items) {
  var index = Math.floor(Math.random() * items.length);
  return items[index];
};

var inspire = function () {
  return random(inspirations);
};

var anticipateThat = function (everythingIsFine) {
  if(everythingIsFine) {
    console.log('Everything is fine, %s! :-)', inspire());
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

  // There is not much use in printing a dot for a successful intent because it doesn't actually tell us anything ... - Golo and Johannes, 11/1/2012
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
15. ETA -  Calculate the Estimated Time! 

*/