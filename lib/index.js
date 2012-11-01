var _ = require('underscore');

var fizz = function (number) {
  return 'fizz';
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

var meet = function (functionUnderTest, reason, goal) {
  var input = goal.in,
      anticipated = goal.out;

  var actual = functionUnderTest(input);

  if (actual !== anticipated) {
    unanticipated(reason, actual, anticipated);
    return false;
  }

  // There is not much use in printing a dot for a successfully met goal because it doesn't actually tell us anything ... - Golo and Johannes, 11/1/2012
  return true; 
};

var mapAll = _.compose(_.all, _.map);

var verify = function (functionUnderTest, reason, intent) {
  var goals = _.flatten([ intent ]);

  return mapAll(goals, function (goal) {
    return meet(functionUnderTest, reason, goal);
  });
};

var verifyAll = function (functionUnderTest, intents) {
  return mapAll(intents, function (intent, reason) { 
    return verify(functionUnderTest, reason, intent); 
  });
};

var test = function (functionUnderTest, intents) {
  var everythingIsFine = verifyAll(functionUnderTest, intents);
  
  anticipateThat(everythingIsFine);  
};

test(fizz, {
  'Numbers that can be divided by 3 are fizz': [
    { in : 3, out : 'fizz' },
    { in : 6, out : 'buzz' }
  ]
});

/*

0. Is it possible to use this testrunner to test itself? How would we do it? 

10. And also more than one intent. 
11. Errors
12. Callbacks
13. More than one In.
6. Eventuell Set einführen
15. ETA -  Calculate the Estimated Time! 
16. Global state for success message (spans multiple calls to test)
17. Improve unanticipated output to show which goal failed

*/