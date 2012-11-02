var _ = require('underscore');

var unanticipated = function (reason, input, actual, anticipated) {
  console.error('%s: Anticipated \'%s\' instead of \'%s\' for %s.', reason, anticipated, actual, JSON.stringify(input));
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
  var index = _.random(0, items.length - 1);
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
  } catch (actual) {
    
    if (error && (error.message === actual.message)) {
      return true;  
    }

    unanticipated(reason, input, actual, anticipated);
    return false;
  }

  if (actual !== anticipated) {
    unanticipated(reason, input, actual, anticipated);
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


test(meet, { 'meet' :  [
      { in : [ function () { throw new Error('Unexpected Error!'); } , 'Reason', { out : 'Expected Result' } ], out : false },
      { in : [ function () { throw new Error('Error!'); } , 'Division by 0 is bad', { in : [ 1, 0 ], error : { message : 'Error!' }} ], out : true }
    ]
  }
);