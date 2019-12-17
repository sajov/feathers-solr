const { _ } = require("@feathersjs/commons");
const uuidv1 = require("uuid/v1");

_.has = function has(obj, key) {
  return key.split(".").every(function(x) {
    if (typeof obj !== "object" || obj === null || !(x in obj)) {
      return false;
    }
    obj = obj[x];
    return true;
  });
};
_.get = function get(obj, key) {
  return key.split(".").reduce(function(o, x) {
    return typeof o === "undefined" || o === null ? o : o[x];
  }, obj);
};

const Operators = {
  $in: (key, value) => {
    return Array.isArray(value)
      ? `${key}:(${value.join(" OR ")})`
      : `${key}:${value}`;
  },
  $or: (key, value) => {
    return Array.isArray(value) ? `(${value.join(" OR ")})` : `${key}:${value}`;
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
    return Array.isArray(value)
      ? `(${value.join(" AND ")})`
      : `${key}:${value}`;
  },
  $ne: (key, value) => {
    return `!${key}:${value}`;
  },
  $and: (key, value) => {
    return `(${value.join(" AND ")})`;
  },
  $nin(key, value) {
    return Array.isArray(value)
      ? `!${key}:(${value.join(" OR ")})`
      : `!${key}:${value}`;
  }
  // notIn: args => {},
  // like: args => {},
  // notLike: args => {},
  // iLike: args => {},
  // notILike: args => {},
  // or: args => {},
  // and: args => {}
};

function jsonQuery(id, filters, query, paginate) {
  let result = {
    query: query.$search || "*:*",
    fields: filters.$select ? filters.$select.join(",") + ",id" : "*,score", // TODO:  score
    limit: paginate.max || paginate.default || 10,
    offset: 0
  };
  delete query.$search;

  if (id && _.has(query, "id")) {
    query.id = `(${id} AND ${query.id})`;
  } else if (id) {
    query.id = id;
  }

  const convertOperators = (query, root = false) => {
    if (Array.isArray(query)) {
      return query.map(q => {
        return convertOperators(q, false);
      });
    }

    if (!_.isObject(query)) {
      return query;
    }

    const converted = Object.keys(query).reduce((res, prop) => {
      const value = query[prop];
      let queryString;

      if (prop === "$or") {
        const o = [].concat.apply([], convertOperators(value, false));
        queryString = Operators.$or(root || prop, o);
      } else if (_.has(Operators, prop)) {
        queryString = Operators[prop](root || prop, value);
      } else if (typeof prop == "string") {
        if (!_.isObject(value)) {
          queryString = Operators.$eq(root || prop, value);
        } else {
          queryString = convertOperators(value, prop);
        }
        if (Array.isArray(queryString)) {
          if (queryString.length > 1) {
            queryString = Operators.$and(root || prop, queryString);
          }
        }
        return res.concat(queryString);
      }
      res.push(queryString);
      return res;
    }, []);

    return converted;
  };

  if (!_.isEmpty(query)) {
    result.filter = convertOperators(query);
  }

  if (filters.$sort) {
    let sort = [];
    Object.keys(filters.$sort).forEach(name => {
      sort.push(
        name + (parseInt(filters.$sort[name]) === 1 ? " asc" : " desc")
      );
    });
    result.sort = sort.join(",");
  }

  if (typeof filters.$limit != "undefined") {
    if (
      paginate &&
      paginate.max &&
      parseInt(filters.$limit) > parseInt(paginate.max)
    )
      return;

    result.limit = parseInt(filters.$limit);
  }

  if (filters.$skip) {
    result.offset = filters.$skip;
  }

  return result;
}

function deleteQuery(id, params) {
  if (id) {
    if (id === "*" || id === "*:*") {
      return { delete: { query: "*:*" } };
    }

    return { delete: id };
  } else if (_.isObject(params)) {
    let crit = [];

    Object.keys(params.query).forEach(function(name) {
      crit.push(name + ":" + params.query[name]);
    });

    return { delete: { query: crit.join(" AND ") } };
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
function patchQuery(data, schema) {
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

function suggestQuery(params, opt) {
  let query = { q: params.query.$suggest };

  if (_.has(params.query, "$params")) {
    query.params = params.query.$params;
  }

  return query;
}

const addId = (item, id) => {
  if (item[id] === undefined) {
    return Object.assign(
      {
        [id]: uuidv1()
      },
      item
    );
  }
  return item;
};

module.exports = {
  addId,
  jsonQuery,
  patchQuery,
  deleteQuery,
  suggestQuery,
  defaultOperators: Operators
};
