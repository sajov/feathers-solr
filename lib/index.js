const { _ } = require("@feathersjs/commons");
const { AdapterService, select } = require("@feathersjs/adapter-commons");
const Client = require("./client");
const core = require("./core");
const utils = require("./utils");
const errors = require("@feathersjs/errors");

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
          multi: true
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
        commitWithin: 36000,
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

  filterQueryNO(params = {}) {
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

  // returns either the model intance for an id or all unpaginated
  // items for `params` if id is null
  _getOrFind(id, params = {}) {
    if (id === null) {
      return this._find(
        Object.assign(params, {
          paginate: false
        })
      );
    }

    return this._get(id, params);
  }

  _get(id, params = {}) {
    // TODO: refactor utils.queryJson
    // const { filters, query, paginate } = this.filterQuery(params);
    params = { query: Object.assign({}, params.query) };

    if (_.has(params, "query.id")) {
      params.query.id = `(${id} AND ${params.query.id})`;
    } else {
      params.query.id = id;
    }

    return this.Model.post("query", utils.queryJson(params)).then(res => {
      if (_.get(res, "response.numFound") === 0) {
        throw new errors.NotFound(`No record found for id '${id}'`);
      }
      return core.responseGet(res);
    });
  }

  _getRealTime(ids) {
    const query = { ids: Array.isArray(ids) ? ids.join(",") : ids };
    return this.Model.get("get", query).then(res => {
      return res.response.docs;
    });
  }

  _find(params = {}) {
    // TODO: refactor utils.queryJson
    const { filters, query, paginate } = this.filterQuery(params);
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

    return this.Model.post("query", queryJson).then(res =>
      core.responseFind(params, this.options, res)
    );
  }

  _create(raw, params = {}) {
    const sel = select(params, this.options.id);
    const addId = item => utils.addId(item, this.options.id);

    let data = (Array.isArray(raw) ? raw : [raw]).map(addId);

    return this.Model.post(
      "update/json",
      data,
      Object.assign(params, this.commit)
    ).then(res => {
      if (data.length) data = data[0];

      return sel(data);
    });
  }

  _patch(id, data, params = {}) {
    const mapIds = data => data.map(current => current[this.id]);

    return this._getOrFind(id, params)
      .then(patches => {
        if (!Array.isArray(patches)) patches = [patches];

        patches = patches.map(patch => {
          return _.omit(Object.assign(patch, data), "_version_", "score");
        });

        const getID = mapIds(patches);

        return this.Model.post("update/json", patches).then(() => {
          return this._getRealTime(getID).then(res => {
            res = res.map(r => {
              return _.omit(r, "_version_", "score");
            });

            return Array.isArray(res) && res.length == 1 ? res[0] : res;
          });
        });
      })
      .then(select(params, this.options.id));
  }

  _remove(id, params = {}) {
    if (id === null && _.isEmpty(params)) {
      throw new errors.MethodNotAllowed(
        "Delete with out id and query is not allowed"
      );
    }

    const promise = this._getOrFind(id, params);
    return promise.then(data => {
      //TODO: handle in no data
      const query = utils.queryDelete(id, params || null);
      const sel = select(params, this.options.id);

      return this.Model.post(
        "update/json",
        query,
        Object.assign(this.commit)
      ).then(res => sel(data));
    });
  }

  _update(id, data, params = {}) {
    if (Array.isArray(data) || id === null) {
      return Promise.reject(
        new errors.BadRequest(
          "Not replacing multiple records. Did you mean `patch`?"
        )
      );
    }
    const promise = id === 0 ? this._find(params) : this._get(id, params);
    return promise.then(res => {
      if (!res[this.options.id]) {
        throw new errors.NotFound(`No record found`);
      }
      const sel = select(params, this.options.id);
      return this.Model.post("update/json", data).then(() => sel(data));
    });
  }
}

module.exports = function init(options) {
  return new Service(options);
};

module.exports.Service = Service;
module.exports.Client = Client;
