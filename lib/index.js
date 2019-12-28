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

    super(
      Object.assign(
        {
          id: 'id',
          commit: {
            softCommit: true,
            commitWithin: 10000,
            overwrite: true
          },
          suggestHandler: 'suggest',
          defaultSearch: {}
        },
        options,
        {
          operators: Object.assign(core.defaultOperators, options.operators),
          whitelist: options.whitelist || core.whitelist
        }
      )
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

    // inject search options
    if (_.has(filtered, 'query.$search')) {
      const searchQuery = Object.assign(this.options.defaultSearch, filtered.query.$params);
      if (!_.isEmpty(searchQuery)) filtered.query.$params = searchQuery;
    }
    return filtered;
  }

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

    // get
    return this.Model.post('query', core.jsonQuery(id, filters, query, paginate)).then(res => {
      if (_.get(res, 'response.numFound') === 0) {
        throw new errors.NotFound(`No record found for id '${id}'`);
      }
      return core.responseGet(res);
    });
  }

  _find(params = {}) {
    const { filters, query, paginate } = this.filterQuery(params);

    // suggest
    if (query.$suggest) return this.Model.get(this.options.suggestHandler, { q: query.$suggest });

    // find
    return this.Model.post('query', core.jsonQuery(null, filters, query, paginate)).then(res => core.responseFind(filters, query, paginate, res));
  }

  async _create(raw, params = {}) {
    if (_.isEmpty(raw)) throw new errors.MethodNotAllowed('Data is empty');
    const sel = select(params, this.id);
    // add uuid
    const addId = item => core.addId(item, this.id);
    const dataToCreate = Array.isArray(raw) ? raw.map(addId) : addId(raw);

    // create data
    await this.Model.post('update/json', Array.isArray(dataToCreate) ? dataToCreate : [dataToCreate], this.options.commit);

    const ids = core.getIds(dataToCreate, this.id);
    const query = { id: { $in: ids } };

    // request and return created data or plain solr response
    return this._find({ query: query }).then(res => sel(ids.length == 1 ? res[0] : res));
  }

  async _patch(id, data, params = {}) {
    const sel = select(params, this.id);

    // request data to patch
    const dataToPatch = await this._getOrFind(id, params);

    // patch query, Atomic Field update
    const { ids, patchData } = core.patchQuery(dataToPatch, data, this.id);

    // patch data
    await this.Model.post('update/json', patchData, this.options.commit);

    // get patched data
    return this._find({ query: { id: { $in: ids } } }).then(res => sel(ids.length == 1 ? res[0] : res));
  }

  async _update(id, data, params = {}) {
    const sel = select(params, this.id);

    // request data to update
    const dataToUpdate = await this._getOrFind(id, params);
    if (!dataToUpdate[this.id]) throw new errors.NotFound('No record found');
    data[this.id] = id || dataToUpdate[this.id];

    // update data
    await this.Model.post('update/json', [data], this.options.commit);

    // get updated data
    return this._getOrFind(id, params).then(res => sel(_.omit(res, 'score', '_version_')));
  }

  async _remove(id, params = {}) {
    if (id === null && _.isEmpty(params)) {
      throw new errors.MethodNotAllowed('Delete with out id and query is not allowed');
    }
    const sel = select(params, this.id);

    // get data to delete
    const dataToDelete = await this._getOrFind(id, params);

    // delete
    const query = core.deleteQuery(id, params || null);
    return this.Model.post('update/json', query, this.options.commit).then(res => sel(dataToDelete));
  }
}

module.exports = function init(options) {
  return new Service(options);
};

module.exports.Service = Service;
module.exports.SolrClient = SolrClient;
