const { _ } = require("@feathersjs/commons");
const { AdapterService } = require("@feathersjs/adapter-commons");
const Client = require("./client");
const core = require("./core");
const utils = require("./utils");
const uuidv1 = require("uuid/v1");
const errors = require("@feathersjs/errors");
// const errorHandler = require("./error-handler");
const debug = require("debug")("feathers-solr");

// Create the service.
class Service extends AdapterService {
  constructor(options) {
    if (!options || !options.Model) {
      throw new Error("You must provide a Model");
    }

    // if (typeof options.name !== "string") {
    //   throw new Error("No table name specified.");
    // }
    const { whitelist = [] } = options;

    super(
      Object.assign(
        {
          id: "id"
        },
        options,
        {
          multiple: true,
          whitelist: whitelist.concat([
            "$search",
            "$params",
            "$facet",
            "$populate"
          ])
        }
      )
    );

    // this.table = options.name;
    this.schema = options.schema;
    this.commit = {
      // wt: "json",
      softCommit: true, // softCommit: true, commit: true, commitWithin: 50
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
    if (_.isEmpty(params)) Object.assign(params, { q: "*:*" });
    return this.Model.get(`query`, params).then(res =>
      core.responseFind(params, this.options, res)
    );
  }

  _get(id, params = {}) {
    params = Object.assign({ query: {} }, params, { $limit: 1, $skip: 0 });
    params.query[this.options.id] = id;
    console.log(utils.queryJson(params));
    console.log("sajov _get", params);
    return this.Model.post(`query`, utils.queryJson(params)).then(res => {
      console.log(res, "?????????");
      console.log(core.responseGet(res));
      return (res = core.responseGet(res));
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
    console.log("CREATE DATA:", data);
    return this.Model.post(
      `update/json`,
      data,
      Object.assign(params, this.commit)
    ).then(res => {
      return (res = data.length == 1 ? data[0] : data);
    });
  }

  _patch(id, data, params = {}) {
    return this.Model.post(`update/json`, data, params);
  }

  _remove(id, params = {}) {
    return this.Model.post(`update/json`, utils.queryDelete(id, params));
  }

  _update(id, data, params = {}) {
    if (id) data.id = id;
    return this.Model.post(`update/json`, data, params).then(res => {
      return (res = data);
    });
  }
}

module.exports = function init(options) {
  return new Service(options);
};

module.exports.Service = Service;
module.exports.Client = Client;
