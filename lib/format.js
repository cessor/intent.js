var _ = require('underscore');

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

var isError = function (object) {
  return looksLikeAnError(object) && behavesLikeES5Error(object);
};

var looksLikeAnError = function (object) {
  return _.isObject(object) && object.name && object.message;
};

var isASetOfFunctions = function (array) {
  return (_.isArray(array) && _.any(array, function (item) { return _.isFunction(item); } ));
};

var behavesLikeES5Error =  function (object) {
  return !object.propertyIsEnumerable('name') && !object.propertyIsEnumerable('message');
};

module.exports = format;