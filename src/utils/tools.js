'use strict';


export function values(obj) {
    return Object.keys(obj).map(key => obj[key]);
}

export function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export function extend(...args) {
    return Object.assign(...args);
}

export function omit(obj, ...keys) {
    const result = Object.assign({}, obj);
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
