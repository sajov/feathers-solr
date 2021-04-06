'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Query = undefined;
exports.queryJson = queryJson;
exports.querySuggest = querySuggest;
exports.queryDelete = queryDelete;
exports.queryPatch = queryPatch;

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
      // sort: '',
      fields: _.get(opt, 'query.$select') || '*,score', // TODO:  score
      limit: _.get(opt, 'paginate.default') || _.get(opt, 'paginate.max') || 10,
      offset: 0
    };
  },
  parseQuery: function parseQuery(query) {

    Object.keys(query).forEach(function (item, index) {
      if (item[0] === '$') {
        if (typeof Query[item] !== 'undefined') {
          Query[item](item, query[item]);
        }
        delete query[index];
      } else {
        Query.filter(item, query[item]);
      }
    });
  },
  filter: function filter(field, param) {
    if (_.isObject(param)) {
      Object.keys(param).forEach(function (f) {
        if (f[0] === '$' && typeof Query[f] !== 'undefined') {
          Query[f](field, param[f]);
        }
      });
    } else if (Array.isArray(param)) {
      if (Array.isArray(param)) {
        param = '(' + param.join(' OR ') + ')';
      }
      this.query.filter.push(field + ':' + param);
    } else {
      this.query.filter.push(field + ':"' + param + '"');
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
      order.push(name + (parseInt(param[name]) === 1 ? ' asc' : ' desc'));
    });
    this.query.sort = order.join(',');
  },
  $select: function $select(field, param) {
    if (Array.isArray(param)) {
      param = param.join(',');
    }
    this.query.fields = param;
  },
  $in: function $in(field, param) {
    if (Array.isArray(param)) {
      param = param.join('" OR "');
    }
    this.query.filter.push(field + ':("' + param + '")');
  },
  $nin: function $nin(field, param) {
    if (Array.isArray(param)) {
      param = param.join('" OR "');
    }
    this.query.filter.push('!' + field + ':("' + param + '")');
  },
  $between: function $between(field, param) {
    if (Array.isArray(param)) {
      param = param.join(' TO ');
    }
    this.query.filter.push(field + ':[' + param + ']');
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
    if (Array.isArray(param)) {
      param = param.join('" OR "');
    }
    this.query.filter.push('!' + field + ':"' + param + '"');
  },
  $or: function $or(field, param) {
    var filter = this.query.filter;
    this.query.filter = [];

    if (Array.isArray(param)) {
      param.forEach(function (item, index) {
        var f = Object.keys(item)[0];
        if (f[0] === '$' && typeof Query[f] !== 'undefined') {
          Query[f](f, item[f]);
        } else {
          Query.filter(f, item[f]);
        }
      });
    } else {

      Object.keys(param).forEach(function (item, index) {

        if (item[0] === '$' && typeof Query[item] !== 'undefined') {
          Query[item](item, param[item]);
        } else {
          Query.filter(item, param[item]);
        }
      });
    }

    if (this.query.filter.length > 0) {
      filter.push('(' + this.query.filter.join(' OR ') + ')');
      this.query.filter = filter;
    }
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

  if (id) {

    if (id === '*' || id === '*:*') {
      return { delete: { query: '*:*' } };
    }

    return { delete: id };
  } else if (_.isObject(params)) {

    var crit = [];

    Object.keys(params).forEach(function (name) {
      crit.push(name + ':' + params[name]);
    });

    return { delete: { query: crit.join(',') } };
  }

  return { delete: { query: '*:*' } };
}

/**
 * Atomic Field Update http://yonik.com/solr/atomic-updates/
 * set – set or replace a particular value, or remove the value if null is specified as the new value
 * add – adds an additional value to a list
 * remove – removes a value (or a list of values) from a list
 * removeregex – removes from a list that match the given Java regular expression
 * inc – increments a numeric value by a specific amount (use a negative value to decrement)
 * { patch_s: {set: 'patched'}} => validate actions
 * { patch_s: 'patched' } => { patch_s: {set: 'patched'}}
 */
function queryPatch(data, schema) {

  var actions = ['set', 'add', 'remove', 'removeregex', 'inc'];

  Object.keys(data).forEach(function (field) {

    var value = data[field];

    /* solr syntax { patch_s: {set: 'patched'}} */
    if (_.isObject(value)) {
      if (actions.indexOf(Object.keys(value)[0]) === -1) {
        data[field] = { add: value };
      }
    } else if (Array.isArray(value)) {
      /* simple syntax { patch_s: 'patched' } => { patch_s: {set: 'patched'}} */
      data[field] = { add: value };
    } else {
      /* simple syntax { patch_s: 'patched' } => { patch_s: {set: 'patched'}} */
      data[field] = value === '' ? { remove: value } : { set: value };
      // data[field] = value === null ? {remove: value} : {set: value};
    }
  });

  return data;
}