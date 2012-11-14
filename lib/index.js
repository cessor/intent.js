var _ = require('underscore');
var compare = require('compare.js');
var format = require('./format.js')
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
  if(_.isFunction(actual) && _.isFunction(anticipated)) {
    return true;
  }
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

var asError = function (object) {
  return util.format('%s: %s', object.name, object.message);
};

module.exports = iAnticipateThat;

// I do not want this here. Ideally this would live in its own file. - JH, 02.11.2012
iAnticipateThat.youTestYourself = function () {
  var func = function () {};
  var lookalikeFunction = function () {};
  var differentFunction = function () { return 0; };
  
  iAnticipateThat(outputWasAnticipated, { 'can vaguely compare functions' : [
      { in: [func, lookalikeFunction], out: true },
      { in: [5, func], out: false }, 
      { in: [func, 'not a function'], out: false } 
    ]
  });

  // This is highly controversial! Golo, I would really like to get your opinion on this feature - JH, 14.11.2012
  iAnticipateThat(outputWasAnticipated, { 'can compare functions of different signatures' : 
    { in: [func, differentFunction], out: true },
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

  var fn = function () { return function (){}; };
  var anAnticipatedFunction = function () {
    return iAnticipateThat(fn, { '\t(OK) I will give you a function': { out: function(){} } });
  };
  iAnticipateThat(anAnticipatedFunction, { 'results in a succeeded test': { out: true } });
  
  var anUnanticipatedFunction = function () {
    return iAnticipateThat(fn, { '\t(OK) I expect nothing': { } });
  };
  iAnticipateThat(anUnanticipatedFunction, { 'results in a failed test': { out: false } });  

  var noFn = function () { };
  var noFunction = function () {
    return iAnticipateThat(noFn, { '\t(OK) I will not give you a function': { out: function(){} } });
  };
  iAnticipateThat(noFunction, { 'results in a failed test': { out: false } });

  var iWouldLikeToReceiveAnArray = function (array) {
    if(!_.isArray(array)) {
      throw new Error('I did not receive an array: ' + typeof(array));
    }
  };
  iAnticipateThat(iWouldLikeToReceiveAnArray, { 'is happy, because it got an array!': { in: [[1,2,3]] }});

  iAnticipateThat(compare.eq, {
    'can compare two integers' :  { in: [5,5], out: true },
    'can compare two different integers' :  { in: [2,3], out: false },
    'can compare two objects' :  { in: [{m:5},{m:5}], out: true },
    'can compare two arrays in a sequence with our own test runner. This test failed, because passing arrays was impossible' : { in: [[1,2,3],[1,2,3]], out:true },
  });
};