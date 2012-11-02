var _ = require('underscore'),
    compare = require('compare.js'),
    util = require('util');

var behavesLikeES5Error =  function (object) {
  return !object.propertyIsEnumerable('name') && !object.propertyIsEnumerable('message');
};

var looksLikeAnError = function (object) {
  return _.isObject(object) && object.name && object.message;
};

var isError = function (object) {
  return looksLikeAnError(object) && behavesLikeES5Error(object);
};

var asError = function (object) {
  return util.format('%s: %s', object.name, object.message);
};

var format = function (object) {
  if (isError(object)) {
    return format(object.toString());
  } 
  if (looksLikeAnError(object)) {
    return format(asError(object));
  }
  if (_.isString(object)) {
    return "'" + object + "'";
  } 
  if(_.isObject(object)) { 
    return JSON.stringify(object); 
  }
  return object;
};

var unanticipated = function (reason, input, actual, anticipated) {
  actual = format(actual);
  anticipated = format(anticipated);
  input = format(input);
  return util.format('%s: Anticipated %s instead of %s for %s.', reason, anticipated, actual, input);
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

var errorWasAnticipated = function (actual, anticipated) {
  return anticipated && compare.lessThanOrEqual(anticipated, actual);
}; 

var outputWasAnticipated = function (actual, anticipated) {
  return compare.equal(actual, anticipated);
};

var meet = function (functionUnderTest, reason, goal) {
  var input = _.flatten([ goal.in ]),
      anticipated = goal.error || goal.out,
      actual;

  try {
    
    actual = functionUnderTest.apply(null, input);
    
    if (outputWasAnticipated(actual, anticipated)) {
      return true; 
    }
  } catch (exception) {
    actual = exception;
    if (errorWasAnticipated(actual, anticipated)) {
      return true;  
    }
  }

  console.error(unanticipated(reason, input, actual, anticipated));
  return false;
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

test.yourself = function () {
  test(format, {
    'Format various types for output': [
      { in : 5, out : 5 },
      { in : true, out : true },
      { in : 'Hello', out : "'Hello'" },
      { in : {}, out : '{}' },
      { in : new Error('Message'), out : "'Error: Message'" },
      { in : { name: 'Error', message: 'Message' }, out : "'Error: Message'" }
    ]
  });
};

module.exports = test;

// test(meet, { 'meet' :  [
//       { in : [ function () { throw new Error('Unexpected Error!'); } , 'Reason', { out : 'Expected Result' } ], out : false },
//       { in : [ function () { throw new Error('Error!'); } , 'Division by 0 is bad', { in : [ 1, 0 ], error : { message : 'Error!' }} ], out : true }
//     ]
//   }
// );