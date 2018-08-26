'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.values = values;
exports.isEmpty = isEmpty;
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.isEqual = isEqual;
exports.mergeDeep = mergeDeep;
exports.extend = extend;
exports.omit = omit;
exports.pairs = pairs;
exports.pick = pick;
exports.removeProps = removeProps;
exports.has = has;
exports.get = get;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function values(obj) {
  return Object.keys(obj).map(function (key) {
    return obj[key];
  });
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function isObject(item) {
  return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
}

function isPlainObject(obj) {
  return isObject(obj) && (obj.constructor === Object || obj.constructor === undefined // obj = Object.create(null)
  );
}

function isEqual(target, sources) {
  var targetProps = Object.getOwnPropertyNames(target);
  var sourcesProps = Object.getOwnPropertyNames(sources);
  if (targetProps.length !== sourcesProps.length) {
    return false;
  }
  for (var i = 0; i < targetProps.length; i++) {
    var propName = targetProps[i];
    // TODO nested
    if (target[propName] !== sources[propName]) {
      return false;
    }
  }
  return true;
}

function mergeDeep(target) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  if (!sources.length) {
    return target;
  }
  var source = sources.shift();

  if (Array.isArray(target)) {
    if (Array.isArray(source)) {
      var _target;

      (_target = target).push.apply(_target, _toConsumableArray(source));
    } else {
      target.push(source);
    }
  } else if (isPlainObject(target)) {
    if (isPlainObject(source)) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(source)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (!target[key]) {
            target[key] = source[key];
          } else {
            mergeDeep(target[key], source[key]);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    } else {
      throw new Error('Cannot merge object with non-object');
    }
  } else {
    target = source;
  }

  return mergeDeep.apply(undefined, [target].concat(sources));
}

function extend() {
  return Object.assign.apply(Object, arguments);
}

function omit(obj) {
  var result = Object.assign({}, obj);

  for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    keys[_key2 - 1] = arguments[_key2];
  }

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = keys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var key = _step2.value;

      delete result[key];
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return result;
}

function pairs(obj) {
  return [Object.keys(obj)[0], obj[Object.keys(obj)[0]]];
}

function pick(source) {
  var result = {};

  for (var _len3 = arguments.length, keys = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    keys[_key3 - 1] = arguments[_key3];
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = keys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var key = _step3.value;

      result[key] = source[key];
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return result;
}

function removeProps(object) {
  var result = Object.assign({}, object);

  for (var _len4 = arguments.length, props = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    props[_key4 - 1] = arguments[_key4];
  }

  props.forEach(function (prop) {
    return delete result[prop];
  });
  return result;
}

function has(obj, key) {
  return key.split('.').every(function (x) {
    if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || obj === null || !(x in obj)) {
      return false;
    }
    obj = obj[x];
    return true;
  });
}
function get(obj, key) {
  return key.split('.').reduce(function (o, x) {
    return typeof o === 'undefined' || o === null ? o : o[x];
  }, obj);
}