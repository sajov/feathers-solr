const { _ } = require('@feathersjs/commons');
const { AdapterService, select } = require('@feathersjs/adapter-commons');
const Client = require('./client');
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

    // Commit strategy
    this.commit = Object.assign(
      {
        softCommit: true,
        commitWithin: 10000,
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

  _getRealTime(ids) {
    const query = { ids: Array.isArray(ids) ? ids.join(',') : ids };
    return this.Model.get('get', query).then(res => {
      return res.response.docs;
    });
  }

  _find(params = {}) {
    const { filters, query, paginate } = this.filterQuery(params);

    return this.Model.post('query', core.jsonQuery(null, filters, query, paginate)).then(res => core.responseFind(filters, query, paginate, res));
  }

  _create(raw, params = {}) {
    if (_.isEmpty(raw)) throw new errors.MethodNotAllowed('Data is empty');

    const addId = item => core.addId(item, this.id);
    const data = Array.isArray(raw) ? raw.map(addId) : addId(raw);

    const sel = select(params, this.id);
    return this.Model.post('update/json', Array.isArray(data) ? data : [data], Object.assign(params, this.commit)).then(res => sel(data));
  }

  _patch(id, data, params = {}) {
    const mapIds = data => data.map(current => current[this.id]);

    return this._getOrFind(id, params)
      .then(patches => {
        if (!Array.isArray(patches)) patches = [patches];

        patches = patches.map(patch => {
          return _.omit(Object.assign(patch, data), '_version_', 'score');
        });

        const getID = mapIds(patches);

        return this.Model.post('update/json', patches).then(() => {
          return this._getRealTime(getID).then(res => {
            res = res.map(r => {
              return _.omit(r, '_version_', 'score');
            });

            return Array.isArray(res) && res.length == 1 ? res[0] : res;
          });
        });
      })
      .then(select(params, this.id));
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

  _update(id, data, params = {}) {
    if (Array.isArray(data) || id === null) {
      return Promise.reject(new errors.BadRequest('Not replacing multiple records. Did you mean `patch`?'));
    }

    const sel = select(params, this.id);
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
module.exports.Client = Client;
