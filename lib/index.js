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
    const whitelist = Object.keys(operators).concat(options.whitelist || []);

    super(
      Object.assign(
        {
          id: 'id'
        },
        options,
        {
          operators,
          whitelist: whitelist.concat(core.whitelist)
        }
      )
    );

    // Search Strategy
    this.search = options.search || {};
    // Commit Strategy
    this.commit = Object.assign(
      {
        softCommit: true,
        commitWithin: 10000,
        overwrite: true
      },
      options.commit || {}
    );
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

  _create(raw, params = {}) {
    if (_.isEmpty(raw)) throw new errors.MethodNotAllowed('Data is empty');
    const addId = item => core.addId(item, this.id);
    const data = Array.isArray(raw) ? raw.map(addId) : addId(raw);

    const sel = select(params, this.id);
    return this.Model.post('update/json', Array.isArray(data) ? data : [data], Object.assign(params, this.commit)).then(res => sel(data));
  }

  async _patch(id, data, params = {}) {
    const toPatch = await this._getOrFind(id, params);
    const { ids, patchData } = core.patchQuery(toPatch, data, this.id);

    await this.Model.post('update/json', patchData, this.commit);

    return this._find({ query: { id: { $in: ids } } })
      .then(select(params, this.id))
      .then(res => {
        return res.map(current => _.omit(current, '_version_', 'score'));
      })
      .then(res => {
        return ids.length == 1 ? res[0] : res;
      });
  }

  _remove(id, params = {}) {
    if (id === null && _.isEmpty(params)) {
      throw new errors.MethodNotAllowed('Delete with out id and query is not allowed');
    }

    return this._getOrFind(id, params).then(data => {
      const query = core.deleteQuery(id, params || null);
      const sel = select(params, this.id);
      return this.Model.post('update/json', query, Object.assign(this.commit)).then(res => sel(data));
    });
  }

  async _update(id, data, params = {}) {
    const sel = select(params, this.id);
    const dataToUpdate = await this._getOrFind(id, params);

    // const ids = select(params, this.id);
    // const query = { [this.id]: { $in: Array.isArray(ids) ? ids : [ids] } };
    // const this._find({query:query}).then(res => {
    // console.log('dataToUpdate', dataToUpdate);

    if (!dataToUpdate[this.id]) {
      throw new errors.NotFound('No record found');
    }
    return this._getOrFind(id, params).then(res => {
      if (!res[this.id]) {
        throw new errors.NotFound('No record found');
      }
      data.id = res.id;
      return this.Model.post('update/json', [data]).then(res => sel(data));
    });
  }
}

module.exports = function init(options) {
  return new Service(options);
};

module.exports.Service = Service;
module.exports.SolrClient = SolrClient;
