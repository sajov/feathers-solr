import { _, queryJson, querySuggest, responseFind, responseGet, queryDelete, describe, queryPatch } from './utils';
import errors from 'feathers-errors';
import Solr from './client/solr';
import makeDebug from 'debug';

const debug = makeDebug('feathers-solr');

class Service {

  constructor(opt = {}) {

    this.options = Object.assign({}, {
      host: 'http://localhost:8983/solr',
      core: '/gettingstarted',
      schema: false,
      migrate: 'safe',
      adminKey: false,
      idfield: 'id',
      managedScheme: true,
      /*commitStrategy softCommit: true, commit: true, commitWithin: 50000*/
      commitStrategy: {
        softCommit: true,
        commitWithin: 50000,
        overwrite: true
      }
    }, opt);

    this.Solr = new Solr({
      host: this.options.host,
      core: this.options.core,
      managedScheme: this.options.managedScheme,
      commitStrategy: this.options.commitStrategy
    });

    debug('feathers-solr service initialized');

    describe(this)
      .then(res => {
        debug('feathers-solr service define done', res);
      })
      .catch(err => {
        debug('Service.define addField ERROR:', err);
      });
  }

  /**
   * [status description]
   * @return {[type]} [description]
   */
  status() {
    return new Promise((resolve, reject) => {
      this.Solr.coreAdmin().status()
        .then(function(res) {
          resolve(res);
        })
        .catch(function(err) {
          return reject(new errors.BadRequest(err));
        });
    });
  }

  /**
   * [find description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  find(params) {
    if (!_.has(params.query, '$suggest')) {
      return this.search(params);
    } else {
      return this.suggest(params);
    }
  }

  /**
   * [find description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  search(params) {
    let _self = this;
    return new Promise((resolve, reject) => {
      this.Solr.json(queryJson(params, _self.options))
        .then(function(res) {
          debug('Service.find', params, res);
          resolve(responseFind(params, _self.options, res));
        })
        .catch(function(err) {
          debug('Service.find ERROR:', err);
          return reject(new errors.BadRequest(err));
        });
    });
  }

  /**
   * Suggest
   * @param  {object} params Query Object
   * @return {object}        Promise
   */
  suggest(params) {
    let _self = this;
    return new Promise((resolve, reject) => {
      this.Solr.suggest(querySuggest(params, _self.options))
        .then(function(res) {
          debug('Service.suggest', params, res);
          resolve(res);
        })
        .catch(function(err) {
          debug('Service.suggest ERROR:', err);
          return reject(new errors.BadRequest(err));
        });
    });
  }

  /**
   * [get description]
   * @param  {[type]} id [description]
   * @return {[type]}    [description]
   */
  get(id, params) {
    let _self = this;

    params = Object.assign({ query: {} }, params, { $limit: 1, $skip: 0 });
    params.query[_self.options.idfield] = id;

    return new Promise((resolve, reject) => {

      this.Solr.json(queryJson(params, _self.options))
        .then(function(res) {
          let docs = responseGet(res);
          if (typeof docs !== 'undefined') {
            return resolve(docs);
          } else {
            return reject(new errors.NotFound(`No record found for id '${id}'`));
          }
        })
        .catch(function(err) {
          console.log('err', err);
          return reject(new errors.NotFound(`No record found for id '${id}'`));
        });
    });
  }

  /**
   * [create description]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  create(data) {

    return new Promise((resolve, reject) => {
      this.Solr.update(data)
        .then(function(res) {
          if (res.responseHeader.status === 0) {
            resolve(data);
          } else {
            console.log('res', res);
            return reject(new errors.BadRequest(res));
          }
        })
        .catch(function(err) {
          console.log('err', err);
          return reject(new errors.BadRequest(err));
        });
    });
  }

  /**
   * adapter.update(id, data, params) -> Promise
   * @param  {[type]} id     [description]
   * @param  {[type]} data   [description]
   * @return {[type]}        [description]
   */
  update(id, data) {

    if (id === null || Array.isArray(data)) {
      return Promise.reject(new errors.BadRequest(
        'You can not replace multiple instances. Did you mean \'patch\'?'
      ));
    }

    let _self = this;
    data[_self.options.idfield] = id;

    return new Promise((resolve, reject) => {
      _self.create(data)
        .then(() => {
          resolve(data);
        })
        .catch((err) => {
          debug('Service.update ERROR:', err);
          return reject(new errors.BadRequest(err));
        });
    });
  }

  /**
   * adapter.patch(id, data, params) -> Promise
   * Using update / overide the doc instead of atomic
   * field update http://yonik.com/solr/atomic-updates/
   * @param  {[type]} id     [description]
   * @param  {[type]} data   [description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */

  /**
   * adapter.patch(id, data, params) -> Promise
   * Atomic Field Update http://yonik.com/solr/atomic-updates/
   * set – set or replace a particular value, or remove the value if null is specified as the new value
   * add – adds an additional value to a list
   * remove – removes a value (or a list of values) from a list
   * removeregex – removes from a list that match the given Java regular expression
   * inc – increments a numeric value by a specific amount (use a negative value to decrement)
   * @param  {mixed}  id     ID Optional for single update
   * @param  {object} data   Patch Data
   * @param  {mixed}  query Query Optional for Multiple Updates
   * @return {object}        Status
   */
  patch(id, data, query) {
    let _self = this;
    return new Promise((resolve, reject) => {

      if(id === null && (!_.isObject(query) || _.isEmpty(query))) {
        return reject(new errors.BadRequest('Missing Params'));
      }
      let patchData = queryPatch(data);
      let createData = [];
      if (id !== null) {
        patchData[_self.options.idfield] = id;
        createData.push(patchData);
        _self.create(createData)
        .then(function(res) {
          return resolve(createData);
        })
        .catch(function(err) {
          return reject(new errors.BadRequest(err));
        });
      } else if(_.isObject(query) && !_.isEmpty(query)) {
        query.$select = [_self.options.idfield];
        _self.Solr
          .json(queryJson({ query: query }, _self.options))
          .then(function(response) {
            response = responseFind(query, _self.options, response);
            if (response.data.length > 0) {
              response.data.forEach((doc, index) => {
                let ref = {};
                ref[_self.options.idfield] = doc[_self.options.idfield];
                createData.push(Object.assign({}, patchData, ref));
              });
              _self.create(createData)
              .then(function(res) {
                return resolve(createData);
              })
              .catch(function(err) {
                return reject(new errors.BadRequest(err));
              });
            } else {
              return resolve(createData);
            }
          })
          .catch(function(err) {
            debug('Service.patch find ERROR:', err);
            return reject(new errors.BadRequest(err));
          });
      } else {
        return reject(new errors.BadRequest('Missing Params'));
      }

    });
  }

  /**
   * Remove Data
   * - .remove('*')              =    {"delete": {"query": "*:*"},"commit": {}}
   * - .remove('*:*')            =    {"delete": {"query": "*:*"},"commit": {}}
   * - .remove('987987FGHJSD')                 =    {"delete": "262","commit": {}}
   * - .remove(['987987FGHJSD','987987FGHJSD'])  =    {"delete": ["262"],"commit": {}}
   * - .remove(null,{'*':'*'}) =    {"delete": {"query": "*:*"},"commit": {}}
   * - .remove(null,{id:257})    =    {"delete": {"query": "id:257"},"commit": {}}
   * - .remove(null,{id:*})      =    {"delete": {"query": "id:*"},"commit": {}}
   * - .remove(null,{other:*})   =    {"delete": {"query": "other:257"},"commit": {}}
   * @param  {[type]} id     [description]
   * @param  {[type]} params [description]
   * @return {[type]}        [description]
   */
  remove(id, params) {

    return new Promise((resolve, reject) => {

      this.Solr.delete(queryDelete(id, params || null))
        .then(function(res) {
          resolve(res);
        })
        .catch(function(err) {
          debug('Service.remove ERROR:', err);
          return reject(new errors.BadRequest(err));
        });
    });
  }

  /**
   * Get Solr Client and use additional functions
   * @return {[type]} [description]
   */
  client() {
    return this.Solr;
  }
}

export default function init(options) {
  return new Service(options);
}

init.Service = Service;
