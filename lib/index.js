var _ = require('underscore');
var compare = require('compare.js');
var inspire = require('./inspire');
var util = require('util');

var mapAll = _.compose(_.all, _.map);

var iAnticipateThat = function (functionUnderTest, intents) {
  var everythingIsFine = verifyAll(functionUnderTest, intents);  
  anticipateThat(everythingIsFine);
  return everythingIsFine;
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
  var input = _.flatten([ goal.in ], true); // is it me, or is this not properly tested? - JH, 14.11.2012
  var anticipated = goal.error || goal.out; // is it me, or is this not properly tested? - JH, 12.11.2012
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
  if (isASetOfFunctions(object)) {
    return format(_.map(_.flatten(object), function () { return 'function'; }));
  }
  if (_.isFunction(object)) {
    return "'function'";
  }
  if (_.isObject(object)) { 
    return JSON.stringify(object); 
  }
  return object;
};

var isASetOfFunctions = function (array) {
  return (_.isArray(array) && _.any(array, function (item) { return _.isFunction(item); } ));
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

module.exports = iAnticipateThat;

// I do not want this here. Ideally this would live in its own file. - JH, 02.11.2012
iAnticipateThat.youTestYourself = function () {
  iAnticipateThat(format, {
    'Format various types for output': [
      { in: 5, out: 5 },
      { in: true, out: true },
      { in: 'Hello', out: "'Hello'" },
      { in: {}, out: '{}' },
      { in: new Error('Message'), out: "'Error: Message'" },
      { in: { name: 'Error', message: 'Message' }, out: "'Error: Message'" },
    ],
    'Should format other stuff for output': [
      { in: [[1,2,3]], out: "[1,2,3]" },
      { in: [[[1],2,3]], out: "[[1],2,3]" },
      { in: [function() {}], out: "'function'" },
      { in: [[function() {}]], out: '["function"]' },
    ]
  });

  var saboteur = function () { throw new Error('Anticipated message') };
  var collaborator = function () { return 49; };
  
  var anticipatedError = function () { 
    return iAnticipateThat(saboteur, { 'throws anticipated error': { error: { message: 'Anticipated message' } } });
  }
  iAnticipateThat(anticipatedError, { 'results in a succeeded test': { out: true } });

  var wrongError = function () {
    return iAnticipateThat(saboteur, { '\t(OK) throws wrong error': { error: { message: 'Unanticipated message' } } });
  };
  iAnticipateThat(wrongError, { 'results in a failed test': { out: false } });

  var noError = function () {
    return iAnticipateThat(collaborator, { '\t(OK) throws no error': { error: { message: 'anything' } } });
  };
  iAnticipateThat(noError, { 'results in a failed test': { out: false } });

  var unanticipatedError = function () {
    return iAnticipateThat(saboteur, { '\t(OK) throws unanticipated error': { out: 'anything' } });
  };
  iAnticipateThat(unanticipatedError, { 'results in a failed test': { out: false } });
  
  var anticipatedOutput = function () {
    return iAnticipateThat(collaborator, { 'returns anticipated output': { out: 49 } });
  };
  iAnticipateThat(anticipatedOutput, { 'results in a succeeded test': { out: true } });

  var wrongOutput = function () {
    return iAnticipateThat(collaborator, { '\t(OK) returns wrong output': { out: 38 } });
  };
  iAnticipateThat(wrongOutput, { 'results in a failed test': { out: false } });

  var iWouldLikeToReceiveAnArray = function (array) {
    if(!_.isArray(array)) {
      throw new Error('I did not receive an array: ' + typeof(array));
    }
  };
  
  iAnticipateThat(iWouldLikeToReceiveAnArray, { 'is happy, because it got an array!': { in: [[1,2,3]] }});

  iAnticipateThat(compare.eq, {
    'can compare two arrays in a sequence' : { in: [[1,2,3],[1,2,3]], out:true },
    'can compare two integers' :  { in: [{m:5},{m:5}], out:true }
  });

  var anyFunction = function () {};
  var anotherFunction = function () {};

  iAnticipateThat(outputWasAnticipated, { 'can vaguely compare functions' : [
      { in: [anyFunction, anotherFunction], out: true },
      { in: [5, anyFunction], out: false }, 
      { in: [anyFunction, 'not a function'], out: false } 
    ]
  });

  iAnticipateThat(isASetOfFunctions, { 
    'identifies arrays containing functions!' :  [
      { in: [[anyFunction, anotherFunction]], out: true },
      { in: [[anyFunction]], out: true },
      { in: [anyFunction], out: false },
      { in: ['A String'], out: false }
  ]});
};