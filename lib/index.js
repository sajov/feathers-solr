const { _ } = require('@feathersjs/commons');
const { AdapterService, select } = require('@feathersjs/adapter-commons');
const { SolrClient } = require('./client/');
const core = require('./core');
const errors = require('@feathersjs/errors');

// Create the service.
class Service extends AdapterService {
  constructor(options = {}) {
    if (!options || !options.Model) {
      throw new Error('You must provide a Model');
    }
    const operators = Object.assign(core.defaultOperators, options.operators);
    const whitelist = options.whitelist || core.whitelist;

    super(
      Object.assign(
        {
          id: 'id',
          commit: {
            softCommit: true,
            commitWithin: 10000,
            overwrite: true
          },
          defaultSearch: {}
        },
        options,
        {
          operators,
          whitelist
        }
      )
    );

    // Search Strategy
    this.search = options.search || {};

    // Suggest Handler
    this.suggest = options.suggest || 'suggest';
  }

  get Model() {
    return this.options.Model;
  }

  get client() {
    return this.Model;
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
    const { filters, query, paginate } = this.filterQuery(params);

    return this.Model.post('query', core.jsonQuery(id, filters, query, paginate)).then(res => {
      if (_.get(res, 'response.numFound') === 0) {
        throw new errors.NotFound(`No record found for id '${id}'`);
      }
      return core.responseGet(res);
    });
  }

  _find(params = {}) {
    const { filters, query, paginate } = this.filterQuery(params);

    if (query.$suggest) {
      return this.Model.get(this.suggest, { q: query.$suggest });
    } else {
      return this.Model.post('query', core.jsonQuery(null, filters, query, paginate)).then(res => core.responseFind(filters, query, paginate, res));
    }
  }

  async _create(raw, params = {}) {
    if (_.isEmpty(raw)) throw new errors.MethodNotAllowed('Data is empty');

    // add uuid
    const addId = item => core.addId(item, this.id);
    const dataToCreate = Array.isArray(raw) ? raw.map(addId) : addId(raw);

    // create data
    await this.Model.post('update/json', Array.isArray(dataToCreate) ? dataToCreate : [dataToCreate], this.options.commit);

    // request and return created data or plain solr response
    const refIds = core.getIds(dataToCreate, this.id);
    const query = { id: { $in: refIds } };
    return this._find({ query: query })
      .then(select(params, this.id))
      .then(res => {
        return refIds.length == 1 ? res[0] : res;
      });
  }

  async _patch(id, data, params = {}) {
    // request data to patch
    const dataToPatch = await this._getOrFind(id, params);

    // patch query, Atomic Field update
    const { ids, patchData } = core.patchQuery(dataToPatch, data, this.id);

    // patch data
    await this.Model.post('update/json', patchData, this.options.commit);

    return this._find({ query: { id: { $in: ids } } })
      .then(select(params, this.id))
      .then(res => {
        return ids.length == 1 ? res[0] : res;
      });
  }

  async _update(id, data, params = {}) {
    const sel = select(params, this.id);
    const dataToUpdate = await this._getOrFind(id, params);

    if (!dataToUpdate[this.id]) {
      throw new errors.NotFound('No record found');
    }

    data[this.id] = id || dataToUpdate[this.id];

    // update
    await this.Model.post('update/json', [data], this.options.commit);

    // get updated data
    const updatedData = await this._getOrFind(id, params);

    return _.omit(sel(updatedData), 'score', '_version_');
  }

  async _remove(id, params = {}) {
    if (id === null && _.isEmpty(params)) {
      throw new errors.MethodNotAllowed('Delete with out id and query is not allowed');
    }
    const sel = select(params, this.id);

    // get delete query
    const query = core.deleteQuery(id, params || null);

    // get data to delete
    const dataToDelete = await this._getOrFind(id, params);

    // delete
    await this.Model.post('update/json', query, this.options.commit);

    return sel(dataToDelete);
  }

  filterQuery(params = {}) {
    const filtered = super.filterQuery(params);

    // inject search options
    if (_.has(filtered, 'query.$search')) {
      const params = Object.assign(this.search, filtered.query.$params);
      if (!_.isEmpty(params)) filtered.query.$params = params;
    }

    // inject suggest options
    if (_.has(filtered, 'query.$suggest')) {
      filtered.query.$params = Object.assign(this.search, filtered.query.$params);
    }

    // inject spellcheck options
    if (_.has(filtered, 'query.$spellcheck')) {
      filtered.query.$params = Object.assign(this.search, filtered.query.$params);
    }

    return filtered;
  }
}

module.exports = function init(options) {
  return new Service(options);
};

module.exports.Service = Service;
module.exports.SolrClient = SolrClient;
