"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIds = exports.patchQuery = exports.deleteQuery = exports.jsonQuery = exports.Operators = exports.whitelist = exports._get = exports._has = exports.addIds = void 0;
//@ts-ignore
const crypto_1 = require("crypto");
const commons_1 = require("@feathersjs/commons");
const addIds = (data, key = 'id') => {
    return data.map((d) => {
        if (!d[key])
            d[key] = (0, crypto_1.randomUUID)();
        return d;
    });
};
exports.addIds = addIds;
const _has = (obj, key) => {
    return key.split('.').every(function (x) {
        if (typeof obj !== 'object' || obj === null || !(x in obj)) {
            return false;
        }
        obj = obj[x];
        return true;
    });
};
exports._has = _has;
const _get = (obj, key) => {
    return key.split('.').reduce(function (o, x) {
        return typeof o === 'undefined' || o === null ? o : o[x];
    }, obj);
};
exports._get = _get;
exports.whitelist = ['$search', '$suggest', '$params', '$facet', '$populate'];
exports.Operators = {
    $in: (key, value) => {
        return Array.isArray(value) ? `${key}:(${value.join(' OR ')})` : `${key}:${value}`;
    },
    $or: (key, value) => {
        return Array.isArray(value) ? `(${value.join(' OR ')})` : `${key}:${value}`;
    },
    $lt: (key, value) => {
        return `${key}:[* TO ${value}}`;
    },
    $lte: (key, value) => {
        return `${key}:[* TO ${value}]`;
    },
    $gt: (key, value) => {
        return `${key}:{${value} TO *]`;
    },
    $gte: (key, value) => {
        return `${key}:[${value} TO *]`;
    },
    $like: (key, value) => {
        return `${key}:{${value}`;
    },
    $notlike: (key, value) => {
        return `!${key}:{${value}`;
    },
    $eq: (key, value) => {
        return Array.isArray(value) ? `(${value.join(' AND ')})` : `${key}:${value}`;
    },
    $ne: (key, value) => {
        return `!${key}:${value}`;
    },
    $and: (value) => {
        return `(${value.join(' AND ')})`;
    },
    $nin(key, value) {
        return Array.isArray(value) ? `!${key}:(${value.join(' OR ')})` : `!${key}:${value}`;
    },
    $limit(filters, paginate) {
        let result = {};
        if (typeof filters.$limit !== 'undefined') {
            if ((0, exports._has)(paginate, 'max') && parseInt(filters.$limit) > parseInt(paginate.max)) {
                return;
            }
            result.limit = parseInt(filters.$limit);
        }
        return result;
    },
    // eslint-disable-next-line no-unused-vars
    $skip(filters) {
        return filters.$skip ? { offset: filters.$skip } : {};
    },
    // eslint-disable-next-line no-unused-vars
    $sort(filters) {
        let result = {};
        if (filters.$sort) {
            let sort = [];
            Object.keys(filters.$sort).forEach(name => {
                sort.push(name + (parseInt(filters.$sort[name]) === 1 ? ' asc' : ' desc'));
            });
            result.sort = sort.join(',');
        }
        return result;
    },
    $params(query) {
        if (query.$params)
            return { params: query.$params };
        return {};
    },
    $facet(query) {
        if (query.$facet)
            return { facet: query.$facet };
        return {};
    },
    $filter(query) {
        if (query.$filter)
            return { filter: Array.isArray(query.$filter) ? query.$filter : [query.$filter] };
        return {};
    }
};
function jsonQuery(id, filters, query, paginate, escapeFn) {
    const adapterQuery = Object.assign({}, query);
    const result = Object.assign({
        query: (adapterQuery.$search || '*:*').toString(),
        fields: Array.isArray(filters.$select) ? filters.$select.join(',') + ',id' : '*,score',
        limit: paginate.max || paginate.default || 10,
        offset: 0
    }, exports.Operators.$sort(filters), exports.Operators.$skip(filters), exports.Operators.$limit(filters, paginate), exports.Operators.$params(adapterQuery), exports.Operators.$facet(adapterQuery), exports.Operators.$filter(adapterQuery));
    // merge id and query // TODO: Fix if query.id has operators
    if (id && (0, exports._has)(adapterQuery, 'id')) {
        adapterQuery.id = `(${id} AND ${adapterQuery.id})`;
    }
    else if (id) {
        adapterQuery.id = id;
    }
    // convert special adapter params
    exports.whitelist.forEach(param => {
        delete adapterQuery[param];
    });
    // convert adapterQuery
    if (!commons_1._.isEmpty(adapterQuery)) {
        result.filter = convertOperators(adapterQuery, escapeFn);
    }
    return result;
}
exports.jsonQuery = jsonQuery;
function convertOperators(query, escapeFn, root = '') {
    if (Array.isArray(query)) {
        return query.map(q => {
            return convertOperators(q, escapeFn);
        });
    }
    if (!commons_1._.isObject(query)) {
        return query;
    }
    const converted = Object.keys(query).reduce((res, prop) => {
        const value = query[prop];
        let queryString;
        if (prop === '$or') {
            const o = [].concat.apply([], convertOperators(value, escapeFn));
            queryString = exports.Operators.$or(root || prop, o);
        }
        else if ((0, exports._has)(exports.Operators, prop)) {
            const escapedResult = escapeFn(root || prop, value);
            queryString = exports.Operators[prop](escapedResult.key, escapedResult.value);
        }
        else if (typeof prop === 'string') {
            if (!commons_1._.isObject(value)) {
                const escapedResult = escapeFn(root || prop, value);
                queryString = exports.Operators.$eq(escapedResult.key, escapedResult.value);
            }
            else {
                queryString = convertOperators(value, escapeFn, prop);
            }
            if (Array.isArray(queryString)) {
                if (queryString.length > 1) {
                    queryString = exports.Operators.$and(root || prop, queryString);
                }
            }
            return res.concat(queryString);
        }
        res.push(queryString);
        return res;
    }, []);
    return converted;
}
function deleteQuery(id, params, escapeFn) {
    if (id) {
        if (id === '*' || id === '*:*') {
            return { delete: { query: '*:*' } };
        }
        return { delete: id };
    }
    else if (commons_1._.isObject(params)) {
        return { delete: { query: convertOperators(params, escapeFn).join(' AND ') } };
    }
    return { delete: { query: '*:*' } };
}
exports.deleteQuery = deleteQuery;
function patchQuery(toPatch, patch, idField) {
    toPatch = Array.isArray(toPatch) ? toPatch : [toPatch];
    const ids = toPatch.map((current) => current[idField]);
    const atomicFieldUpdate = {};
    const actions = ['set', 'add', 'remove', 'removeregex', 'inc'];
    Object.keys(patch).forEach(field => {
        if (field !== idField) {
            const value = patch[field];
            if (commons_1._.isObject(value)) {
                if (actions.indexOf(Object.keys(value)[0]) === -1) {
                    atomicFieldUpdate[field] = { add: value };
                }
            }
            else if (Array.isArray(value)) {
                atomicFieldUpdate[field] = { add: value };
            }
            else {
                atomicFieldUpdate[field] = value === '' ? { remove: value } : { set: value };
            }
        }
    });
    const patchData = toPatch.map((current) => {
        return Object.assign({ [idField]: current[idField] }, atomicFieldUpdate);
    });
    return { ids, patchData };
}
exports.patchQuery = patchQuery;
const getIds = (data, id) => {
    if (!Array.isArray(data) && data[id])
        return [data[id]];
    return data.map((d) => {
        return d[id];
    });
};
exports.getIds = getIds;
//# sourceMappingURL=query.js.map