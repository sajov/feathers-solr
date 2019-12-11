const { _ } = require("@feathersjs/commons");

const METHODS = {
  $or: "orWhere",
  $and: "andWhere",
  $ne: "whereNot",
  $in: "whereIn",
  $nin: "whereNotIn"
};

const OPERATORS = {
  $lt: (key, value) => {
    return `${key}:[* TO ${value}]`;
  },
  $lte: (key, value) => {
    return `${key}:[* TO ${value}}`;
  },
  $gt: (key, value) => {
    return `${key}:[${value} TO *]`;
  },
  $gte: (key, value) => {
    return `${key}:{${value} TO *]`;
  },
  $like: (key, value) => {
    return `${key}:{${value}`;
  },
  $notlike: (key, value) => {
    return `!${key}:{${value}`;
  }
};

const Query = {
  query: {},

  init(opt) {
    this.opt = opt;
    this.query = {
      query: "*:*", // TODO:  score
      filter: [],
      // sort: '',
      fields: _.get(opt, "query.$select") || "*,score", // TODO:  score
      limit:
        _.get(opt, "paginate.max") ||
        _.get(opt, "paginate.default", false) ||
        10,
      offset: 0
    };
  },

  parseQuery(query) {
    Object.keys(query).forEach(function(item, index) {
      if (item[0] === "$") {
        if (typeof Query[item] !== "undefined") {
          Query[item](item, query[item]);
        }
        delete query[index];
      } else {
        Query.filter(item, query[item]);
      }
    });
  },

  filter(field, param) {
    if (_.isObject(param)) {
      Object.keys(param).forEach(function(f) {
        if (f[0] === "$" && typeof Query[f] !== "undefined") {
          Query[f](field, param[f]);
        }
      });
    } else if (Array.isArray(param)) {
      if (Array.isArray(param)) {
        param = "(" + param.join(" OR ") + ")";
      }
      this.query.filter.push(field + ":" + param);
    } else {
      this.query.filter.push(field + ":" + param);
    }
  },

  $search(field, param) {
    this.query.query = param;
  },

  $limit(field, param) {
    if (param == 4) console.log(this.query.limit);
    if (
      !_.has(this.opt, "paginate.max") ||
      _.get(this.opt, "paginate.max", param) >= param
    )
      this.query.limit = param;
    if (param == 4) console.log(this.query.limit);
  },

  $skip(field, param) {
    this.query.offset = param;
  },

  $sort(field, param) {
    let order = [];
    Object.keys(param).forEach(name => {
      order.push(name + (parseInt(param[name]) === 1 ? " asc" : " desc"));
    });
    this.query.sort = order.join(",");
  },

  $select(field, param) {
    if (Array.isArray(param)) {
      if (param.indexOf("id") === -1) param.push("id");
      param = param.join(",");
    }
    this.query.fields = param;
  },

  $in(field, param) {
    if (Array.isArray(param)) {
      param = param.join('" OR "');
    }
    this.query.filter.push(field + ':("' + param + '")');
  },

  $nin(field, param) {
    if (Array.isArray(param)) {
      param = param.join('" OR "');
    }
    this.query.filter.push("!" + field + ':("' + param + '")');
  },

  $between(field, param) {
    if (Array.isArray(param)) {
      param = param.join(" TO ");
    }
    this.query.filter.push(field + ":[" + param + "]");
  },

  $lt(field, param) {
    this.query.filter.push(field + ":[* TO " + param + "}");
  },

  $lte(field, param) {
    this.query.filter.push(field + ":[* TO " + param + "]");
  },

  $gt(field, param) {
    this.query.filter.push(field + ":{" + param + " TO *]");
  },

  $gte(field, param) {
    this.query.filter.push(field + ":[" + param + " TO *]");
  },

  $ne(field, param) {
    if (Array.isArray(param)) {
      param = param.join('" OR "');
    }
    this.query.filter.push("!" + field + ':"' + param + '"');
  },

  $or(field, param) {
    let filter = this.query.filter;
    this.query.filter = [];

    if (Array.isArray(param)) {
      param.forEach(function(item, index) {
        var f = Object.keys(item)[0];
        if (f[0] === "$" && typeof Query[f] !== "undefined") {
          Query[f](f, item[f]);
        } else {
          Query.filter(f, item[f]);
        }
      });
    } else {
      Object.keys(param).forEach(function(item, index) {
        if (item[0] === "$" && typeof Query[item] !== "undefined") {
          Query[item](item, param[item]);
        } else {
          Query.filter(item, param[item]);
        }
      });
    }

    if (this.query.filter.length > 0) {
      filter.push("(" + this.query.filter.join(" OR ") + ")");
      this.query.filter = filter;
    }
  },

  $qf(field, params) {
    this.query.params = Object.assign({}, this.query.params || {}, {
      qf: params
    });
  },

  $facet(field, params) {
    this.query.facet = Object.assign(this.query.facet || {}, params);
  },

  $params(field, params) {
    this.query.params = Object.assign(this.query.params || {}, params);
  }
};

function queryJson(params, opt) {
  if (_.has(params, "paginate")) {
    Object.keys(params.paginate).forEach(o => {
      opt.paginate[o] = params.paginate[o];
    });
  }

  Query.init(opt);

  if (_.has(params, "query")) {
    Query.parseQuery(params.query);
  }

  if (Query.query.filter.length === 0) delete Query.query.filter;

  return Query.query;
}

function queryDelete(id, params) {
  if (id) {
    if (id === "*" || id === "*:*") {
      return { delete: { query: "*:*" } };
    }

    return { delete: id };
  } else if (_.isObject(params)) {
    let crit = [];

    Object.keys(params).forEach(function(name) {
      crit.push(name + ":" + params[name]);
    });

    return { delete: { query: crit.join(",") } };
  }

  return { delete: { query: "*:*" } };
}

function queryUpdate(id, params) {
  if (id) {
    if (id === "*" || id === "*:*") {
      return { delete: { query: "*:*" } };
    }

    return { delete: id };
  } else if (_.isObject(params)) {
    let crit = [];

    Object.keys(params).forEach(function(name) {
      crit.push(name + ":" + params[name]);
    });

    return { delete: { query: crit.join(",") } };
  }

  return { delete: { query: "*:*" } };
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
  const actions = ["set", "add", "remove", "removeregex", "inc"];

  Object.keys(data).forEach(field => {
    let value = data[field];

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
      data[field] = value === "" ? { remove: value } : { set: value };
      // data[field] = value === null ? {remove: value} : {set: value};
    }
  });

  return data;
}

function querySuggest(params, opt) {
  let query = { q: params.query.$suggest };

  if (_.has(params.query, "$params")) {
    query.params = params.query.$params;
  }

  return query;
}

const Op = {
  lt: (key, value) => {
    return `${key}:[* TO ${value}]`;
  },
  lte: (key, value) => {
    return `${key}:[* TO ${value}}`;
  },
  gt: (key, value) => {
    return `${key}:[${value} TO *]`;
  },
  gte: (key, value) => {
    return `${key}:{${value} TO *]`;
  },
  like: (key, value) => {
    return `${key}:{${value}`;
  },
  notlike: (key, value) => {
    return `!${key}:{${value}`;
  }
  // eq: args => {},
  // ne: args => {},
  // gte: args => {},
  // gt: args => {},
  // lte: args => {},
  // lt: args => {},
  // in: args => {},
  // notIn: args => {},
  // like: args => {},
  // notLike: args => {},
  // iLike: args => {},
  // notILike: args => {},
  // or: args => {},
  // and: args => {}
};
const operators = Op => {
  return {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $in: Op.in,
    $nin: Op.notIn,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $or: Op.or,
    $and: Op.and
  };
};

const defaultOperators = operators(Op);

module.exports = {
  Query,
  queryJson,
  queryPatch,
  queryDelete,
  querySuggest,
  defaultOperators
};
