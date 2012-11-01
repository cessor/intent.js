var _ = require('underscore');

var functionUnderTest = function () {
  return 4;
};

var unanticipated = function (title, actual, anticipated) {
  console.error('The outcome of the intent \'' + title + '\' was unanticipated: ' + actual + '. I anticipated: ' + anticipated + '.');
}; 

var verify = function (fn, intent, key) {
  var input = intent.in,
      anticipated = intent.out;

  var actual = fn(input);

  if (actual !== anticipated) {
    unanticipated(key, actual, anticipated);
  } 
};

var test = function (fn, intents) {
  _.each(intents, function (intent, key) { 
    verify(fn, intent, key); 
  });
};

test(functionUnderTest, {
  'I convey intent': { in : 0, out : 5 }
});


/*

4. Please check for a proper formatting in the test runner output 
4.5    Introduce C syntax
5. Merge intent and key into an intention object 
6. Eventuell Set einführen
7. Put in an else clause that show that the test was successfull
8. Rename the parameter to functionUnderTest

*/