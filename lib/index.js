var _ = require('underscore');
var compare = require('compare.js');
var inspire = require('./inspire');
var util = require('util');

var mapAll = _.compose(_.all, _.map);

var test = function (functionUnderTest, intents) {
  var everythingIsFine = verifyAll(functionUnderTest, intents);  
  anticipateThat(everythingIsFine);
  return everythingIsFine;
};

test.callback = function (goal) {
  return function () {
    // Mock
    // ...

    // Stub
    if (goal.error) {
      throw goal.error;
    }
    return goal.out;
  };
};

var anticipateThat = function (everythingIsFine) {
  if(everythingIsFine) {
    console.log('Everything is fine, %s! :-)', inspire());
  }
};

var verifyAll = function (functionUnderTest, intents) {
  return mapAll(intents, function (intent, reason) {
    return verify(functionUnderTest, reason, intent);
  });
};

var verify = function (functionUnderTest, reason, intent) {
  var goals = _.flatten([ intent ]);
  return mapAll(goals, function (goal) { 
    return meet(functionUnderTest, reason, goal);
  });
};

var meet = function (functionUnderTest, reason, goal) {
  var input = _.flatten([ goal.in ]);
  var anticipated = goal.error || goal.out;
  var actual;

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

var outputWasAnticipated = function (actual, anticipated) {
  return compare.equal(actual, anticipated);
};

var errorWasAnticipated = function (actual, anticipated) {
  return anticipated && compare.lessThanOrEqual(anticipated, actual);
}; 

var unanticipated = function (reason, input, actual, anticipated) {
  input = format(input);
  actual = format(actual);
  anticipated = format(anticipated);
  return util.format('%s: Anticipated %s instead of %s for %s.', reason, anticipated, actual, input);
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
  if (_.isObject(object)) { 
    return JSON.stringify(object); 
  }
  return object;
};

var isError = function (object) {
  return looksLikeAnError(object) && behavesLikeES5Error(object);
};

var looksLikeAnError = function (object) {
  return _.isObject(object) && object.name && object.message;
};

var behavesLikeES5Error =  function (object) {
  return !object.propertyIsEnumerable('name') && !object.propertyIsEnumerable('message');
};

var asError = function (object) {
  return util.format('%s: %s', object.name, object.message);
};

module.exports = test;

// I do not want this here. Ideally this would live in its own file. - JH, 02.11.2012
test.yourself = function () {
  test(format, {
    'Format various types for output': [
      { in: 5, out: 5 },
      { in: true, out: true },
      { in: 'Hello', out: "'Hello'" },
      { in: {}, out: '{}' },
      { in: new Error('Message'), out: "'Error: Message'" },
      { in: { name: 'Error', message: 'Message' }, out: "'Error: Message'" }
    ]
  });

  var saboteur = function () { throw new Error('Anticipated message') };
  var collaborator = function () { return 49; };
  
  var anticipatedError = function () { 
    return test(saboteur, { 'throws anticipated error': { error: { message: 'Anticipated message' } } });
  }
  test(anticipatedError, { 'results in a succeeded test': { out: true } });

  var wrongError = function () {
    return test(saboteur, { 'throws wrong error': { error: { message: 'Unanticipated message' } } });
  };
  test(wrongError, { 'results in a failed test': { out: false } });

  var noError = function () {
    return test(collaborator, { 'throws no error': { error: { message: 'anything' } } });
  };
  test(noError, { 'results in a failed test': { out: false } });

  var unanticipatedError = function () {
    return test(saboteur, { 'throws unanticipated error': { out: 'anything' } });
  };
  test(unanticipatedError, { 'results in a failed test': { out: false } });
  
  var anticipatedOutput = function () {
    return test(collaborator, { 'returns anticipated output': { out: 49 } });
  };
  test(anticipatedOutput, { 'results in a succeeded test': { out: true } });

  var wrongOutput = function () {
    return test(collaborator, { 'returns wrong output': { out: 38 } });
  };
  test(wrongOutput, { 'results in a failed test': { out: false } });  
};