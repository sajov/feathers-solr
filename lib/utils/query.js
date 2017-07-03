'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Query = undefined;
exports.queryJson = queryJson;
exports.querySuggest = querySuggest;
exports.queryDelete = queryDelete;

var _tools = require('./tools');

var _ = _interopRequireWildcard(_tools);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Query = exports.Query = {

    query: {},

    init: function init(opt) {

        this.opt = opt;
        this.query = {
            query: '*:*', // TODO:  score
            filter: [],
            sort: '',
            fields: _.get(opt, 'query.$select') || '*,score', // TODO:  score
            limit: _.get(opt, 'paginate.default') || _.get(opt, 'paginate.max') || 10,
            offset: 0
        };
    },
    parseQuery: function parseQuery(query) {

        Object.keys(query).forEach(function (item, index) {
            if (item[0] === '$' && typeof Query[item] !== 'undefined') {
                Query[item](item, query[item]);
            } else {
                Query.filter(item, query[item]);
            }
        });
    },
    filter: function filter(field, param) {

        if (typeof param === 'string') {

            this.query.filter.push(field + ':' + param);
        } else if (Array.isArray(param)) {

            if (Array.isArray(param)) {
                param = '(' + param.join(' OR ') + ')';
            }
            this.query.filter.push(field + ':' + param);
        } else {

            Object.keys(param).forEach(function (f) {
                if (f[0] === '$' && typeof Query[f] !== 'undefined') {
                    Query[f](field, param[f]);
                }
            });
        }
    },
    $search: function $search(field, param) {
        this.query.query = param;
    },
    $limit: function $limit(field, param) {
        this.query.limit = param;
    },
    $skip: function $skip(field, param) {
        this.query.offset = param;
    },
    $sort: function $sort(field, param) {

        var order = [];

        Object.keys(param).forEach(function (name) {
            order.push(name + (param[name] === '1' ? ' asc' : ' desc'));
        });

        this.query.sort = order.join(' ');
    },
    $select: function $select(field, param) {
        this.query.fields = param;
    },
    $in: function $in(field, param) {
        this.query.filter.push(field + ':(' + param.join(' OR ') + ')');
    },
    $nin: function $nin(field, param) {
        this.query.filter.push('!' + field + ':(' + param.join(' OR ') + ')');
    },
    $lt: function $lt(field, param) {
        this.query.filter.push(field + ':[* TO ' + param + '}');
    },
    $lte: function $lte(field, param) {
        this.query.filter.push(field + ':[* TO ' + param + ']');
    },
    $gt: function $gt(field, param) {
        this.query.filter.push(field + ':{' + param + ' TO *]');
    },
    $gte: function $gte(field, param) {
        this.query.filter.push(field + ':[' + param + ' TO *]');
    },
    $ne: function $ne(field, param) {
        this.query.filter.push('!' + field + ':' + param);
    },
    $or: function $or(field, param) {

        var filter = this.query.filter;
        this.query.filter = [];

        Object.keys(param).forEach(function (item, index) {

            if (item[0] === '$' && typeof Query[item] !== 'undefined') {
                Query[item](item, param[item]);
            } else {
                Query.filter(item, param[item]);
            }
        });

        filter.push('(' + this.query.filter.join(' OR ') + ')');
        this.query.filter = filter;
    },
    $qf: function $qf(field, params) {
        this.query.params = Object.assign({}, this.query.params || {}, { qf: params });
    },
    $facet: function $facet(field, params) {
        this.query.facet = Object.assign(this.query.facet || {}, params);
    },
    $params: function $params(field, params) {
        this.query.params = Object.assign(this.query.params || {}, params);
    }
};

function queryJson(params, opt) {

    Query.init(opt);

    if (_.has(params, 'query')) {
        Query.parseQuery(params.query);
    }
    return Query.query;
}

function querySuggest(params, opt) {

    var query = { q: params.query.$suggest };

    if (_.has(params.query, '$params')) {
        query.params = params.query.$params;
    }

    return query;
}

function queryDelete(id, params) {
    if (id !== null) {
        // if (Array.isArray(id)) {
        //     id = id;
        // }
        return { delete: { id: id } };
    }

    // if (params) {
    //   //TODO' implement array
    //   let pairs = _.pairs(params.query);
    //   return { delete: { query: (pairs[0] || '*') + ':' + (pairs[1] || '*') } };
    // }

    return { delete: { query: '*' } };
}