var _ = require('underscore');

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
  var input = _.flatten([ goal.in ]),
      anticipated = goal.out,
      error = goal.error;

  try {
    var actual = functionUnderTest.apply(null, input);    
  } catch (e) {
    // 1) Exception has not been expected, but was thrown. => FAIL
    if(!error) {
      unanticipated(reason, e.constructor.name + ': ' + e.message || '(Exception)', anticipated);
      return false;
    }

    // 2 a) Exception has been expected, but wrong one was thrown. => FAIL
    // TODO

    // 2 b) Exception has been expected and appropriate one was thrown. => OK
    return true;
  }

  // 3) Exception has been expected, but has not been thrown. => FAIL
  if(error) {
    // TODO
  }

  // 4) Exception has not been expected and no exception was thrown. => OK
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

module.exports = test;

/*

11. Errors
12. Callbacks
15. ETA -  Calculate the Estimated Time! 
16. Global state for success message (spans multiple calls to test)
16.5. Show which test file has been run
17. Improve unanticipated output to show which goal failed
18. Write README.md ;-)
19. Make it run in the browser
20. use _.random(min, max)
21. Was machen wir eigentlich, wenn's keine Parameter gibt?
22. Wie Exceptions darstellen?
0. Is it possible to use this testrunner to test itself? How would we do it? 

*/