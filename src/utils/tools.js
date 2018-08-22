'use strict';

export function values(obj) {
  return Object.keys(obj).map(key => obj[key]);
}

export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function isPlainObject(obj) {
  return isObject(obj) && (
    obj.constructor === Object || obj.constructor === undefined // obj = Object.create(null)
  );
}

export function isEqual(target, sources) {
  var targetProps = Object.getOwnPropertyNames(target);
  var sourcesProps = Object.getOwnPropertyNames(sources);
  if (targetProps.length !== sourcesProps.length) {
    return false;
  }
  for (var i = 0; i < targetProps.length; i++) {
    var propName = targetProps[i];
    if (target[propName] !== sources[propName]) {
      return false;
    }
  }
  return true;
}

export function mergeDeep(target, sources) {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (Array.isArray(target)) {
    if (Array.isArray(source)) {
      target.push(...source);
    } else {
      target.push(source);
    }
  } else if (isPlainObject(target)) {
    if (isPlainObject(source)) {
      for (let key of Object.keys(source)) {
        if (!target[key]) {
          target[key] = source[key];
        } else {
          mergeDeep(target[key], source[key]);
        }
      }
    } else {
      throw new Error(`Cannot merge object with non-object`);
    }
  } else {
    target = source;
  }

  return mergeDeep(target, ...sources);
}

export function extend(...args) {
  return Object.assign(...args);
}

export function omit(obj, ...keys) {
  let result = Object.assign({}, obj);
  for (let key of keys) {
    delete result[key];
  }
  return result;
}

export function pairs(obj) {
  return [Object.keys(obj)[0], obj[Object.keys(obj)[0]]];
}

export function pick(source, ...keys) {
  const result = {};
  for (let key of keys) {
    result[key] = source[key];
  }
  return result;
}

export function removeProps(object, ...props) {
  let result = Object.assign({}, object);
  props.forEach(prop => delete result[prop]);
  return result;
}

export function has(obj, key) {
  return key.split('.').every(function(x) {
    if (typeof obj !== 'object' || obj === null || !(x in obj)) {
      return false;
    }
    obj = obj[x];
    return true;
  });
}
export function get(obj, key) {
  return key.split('.').reduce(function(o, x) {
    return (typeof o === 'undefined' || o === null) ? o : o[x];
  }, obj);
}
