const { _ } = require("@feathersjs/commons");
const { AdapterService } = require("@feathersjs/adapter-commons");
const Client = require("./client");
const core = require("./core");
const utils = require("./utils");
const uuidv1 = require("uuid/v1");
const errors = require("@feathersjs/errors");
// const errorHandler = require("./error-handler");
const debug = require("debug")("feathers-solr-service");
const _select = (data, ...args) => {
  const base = select(...args);

  return base(JSON.parse(JSON.stringify(data)));
};

// Create the service.
class Service extends AdapterService {
  constructor(options = {}) {
    if (!options || !options.Model) {
      throw new Error("You must provide a Model");
    }

    const { whitelist = [] } = options;

    super(
      Object.assign(
        {
          id: "id",
          multiple: true
        },
        options,
        {
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

    this.schema = options.schema;

    // commit strategy
    this.commit = {
      softCommit: true,
      commitWithin: 10,
      overwrite: true
    };
  }

  get Model() {
    return this.options.Model;
  }

  get client() {
    return this.Model;
  }

  _find(params = {}) {
    // TODO: refactor utils.queryJson
    // const { filters, query, paginate } = this.filterQuery(params);
    debug("find.utils.queryJson", utils.queryJson(params));
    return this.Model.post("query", utils.queryJson(params)).then(res =>
      core.responseFind(params, this.options, res)
    );
  }

  _get(id, params = {}) {
    params = Object.assign({ query: { id: id } }, params);

    return this.Model.post("query", utils.queryJson(params)).then(res => {
      return core.responseGet(res);
    });
  }

  _create(data, params = {}) {
    if (!Array.isArray(data)) {
      data = [data];
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
      return (res = data.length == 1 ? data[0] : data);
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
