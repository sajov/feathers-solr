const { _ } = require("@feathersjs/commons");
const { AdapterService, select } = require("@feathersjs/adapter-commons");
const Client = require("./client");
const core = require("./core");
const utils = require("./utils");
const uuidv1 = require("uuid/v1");
const errors = require("@feathersjs/errors");
// const errorHandler = require("./error-handler");
const debug = require("debug")("feathers-solr-service");

// Create the service.
class Service extends AdapterService {
  constructor(options = {}) {
    if (!options || !options.Model) {
      throw new Error("You must provide a Model");
    }
    const operators = Object.assign(utils.defaultOperators, options.operators);
    const whitelist = Object.keys(operators).concat(options.whitelist || []);

    super(
      Object.assign(
        {
          id: "id",
          multiple: true
        },
        options,
        {
          operators,
          whitelist: whitelist.concat([
            "$search",
            "$suggest",
            "$params",
            "$facet",
            "$populate"
          ])
        }
      )
    );

    // Schema Handler
    this.schema = options.schema;

    // commit strategy
    this.commit = Object.assign(
      {
        softCommit: true,
        commitWithin: 10,
        overwrite: true
      },
      options.commit || {}
    );
  }

  get Model() {
    return this.options.Model;
  }

  get client() {
    return this.Model;
  }

  filterQuery(params = {}) {
    const filtered = super.filterQuery(params);
    const operators = this.options.operators;
    const convertOperators = query => {
      if (Array.isArray(query)) {
        return query.map(convertOperators);
      }

      if (!_.isObject(query)) {
        return query;
      }

      const converted = Object.keys(query).reduce((result, prop) => {
        const value = query[prop];
        console.log(prop);
        const key = operators[prop] ? operators[prop](prop, value) : prop;
        // console.log("KEY VALUE", key, value);

        result[key] = convertOperators(value);
        console.log("RESULT[KEY]", result[key]);

        return result;
      }, {});

      Object.getOwnPropertySymbols(query).forEach(symbol => {
        console.log("symbol", symbol);
        console.log("query", query[symbol]);
        converted[symbol] = query[symbol];
      });

      return converted;
    };

    filtered.query = convertOperators(filtered.query);

    return filtered;
  }

  _find(params = {}) {
    // TODO: refactor utils.queryJson
    const { filters, query, paginate } = this.filterQuery(params);
    console.log("filters", filters);
    console.log("query", query);
    console.log("query.$or", query.$or);
    if (_.has(params, "paginate")) {
      this.options.paginate = params.paginate;
    }
    if (
      _.has(params, "query.$limit") &&
      _.get(params, "query.$limit") > paginate.max
    ) {
      params.query.$limit = paginate.max;
    }
    const queryJson = utils.queryJson(params, this.options);
    debug("find.utils.queryJson", queryJson);
    return this.Model.post("query", queryJson).then(res =>
      core.responseFind(params, this.options, res)
    );
  }

  _get(id, params = {}) {
    params = { query: Object.assign({ id: id }, params) };
    return this.Model.post("query", utils.queryJson(params)).then(res => {
      return core.responseGet(res);
    });
  }

  _create(data, params = {}) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    if (data.length === 0) {
      throw new errors.MethodNotAllowed("Removing multiple without option set");
    }

    data.map(d => {
      if (!d[this.options.id]) {
        d[this.options.id] = uuidv1();
      }
      return d;
    });

    return this.Model.post(
      "update/json",
      data,
      Object.assign(params, this.commit)
    ).then(res => {
      res = data.length == 1 ? data[0] : data;

      if (_.has(params, "query.$select")) {
        res = _.pick(res, params.query.$select);
      }

      return res;
    });
  }

  _patch(id, data, params = {}) {
    return this.Model.post("update/json", data, params);
  }

  _remove(id, params = {}) {
    const query = utils.queryDelete(id, params || null);
    debug("remove", query);
    return this.Model.post("update/json", query, Object.assign(this.commit));
  }

  _update(id, data, params = {}) {
    if (id) data.id = id;
    // TODO: remove fake response
    debug("update", data);
    return this.Model.post("update/json", data).then(res => {
      return data;
    });
  }
}

module.exports = function init(options) {
  return new Service(options);
};

module.exports.Service = Service;
module.exports.Client = Client;
