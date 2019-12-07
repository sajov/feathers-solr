// const { _ } = require('@feathersjs/commons');
const { AdapterService } = require("@feathersjs/adapter-commons");
const Client = require("./client");
// const errors = require('@feathersjs/errors');

// const errorHandler = require("./error-handler");

// const debug = require('debug')('feathers-solr');

// Create the service.
class Service extends AdapterService {
  constructor(options) {
    if (!options || !options.Model) {
      throw new Error("You must provide a Model");
    }

    if (typeof options.name !== "string") {
      throw new Error("No table name specified.");
    }
    const { whitelist = [] } = options;

    super(
      Object.assign(
        {
          id: "id"
        },
        options,
        {
          whitelist: whitelist.concat([
            "$search",
            "$params",
            "$facet",
            "$populate"
          ])
        }
      )
    );

    this.table = options.name;
    this.schema = options.schema;
  }

  get Model() {
    return this.options.Model;
  }

  get client() {
    return this.Model;
  }

  _find(params = {}) {
    return this.Model.get("query", params);
  }

  _get(id, params = {}) {
    return this.Model.get(`query/${id}`, params);
  }

  _create(data, params = {}) {
    return this.Model.post("update", data, params);
  }

  _patch(id, data, params = {}) {
    return this.Model.post("update", data, params);
  }

  _remove(id, params = {}) {
    return this.Model.post("update", params);
  }

  _update(id, data, params = {}) {
    return this.Model.post("update", data, params);
  }
}

module.exports = function init(options) {
  return new Service(options);
};

module.exports.Service = Service;
module.exports.Client = Client;
