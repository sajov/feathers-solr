'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = init;

var _utils = require('./utils');

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _solr = require('./client/solr');

var _solr2 = _interopRequireDefault(_solr);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = (0, _debug2.default)('feathers-solr');

var Service = function () {
  function Service() {
    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Service);

    this.options = Object.assign({}, {
      host: 'http://localhost:8983/solr',
      core: '/gettingstarted',
      schema: false,
      migrate: 'safe',
      adminKey: false,
      idfield: 'id',
      managedScheme: true,
      /*commitStrategy softCommit: true, commit: true, commitWithin: 50*/
      commitStrategy: {
        softCommit: true,
        commitWithin: 50000,
        overwrite: true
      }
    }, opt);

    this.Solr = new _solr2.default({
      host: this.options.host,
      core: this.options.core,
      managedScheme: this.options.managedScheme,
      commitStrategy: this.options.commitStrategy
    });
    debug('feathers-solr service initialized');
    var _self = this;
    (0, _utils.describe)(this).then(function (res) {
      debug('feathers-solr service define done');
    }).catch(function (err) {
      debug('Service.define addField ERROR:', err);
    });
  }

  /**
   * [status description]
   * @return {[type]} [description]
   */


  _createClass(Service, [{
    key: 'status',
    value: function status() {
      var coreAdmin = this.Solr.coreAdmin();
      coreAdmin.status().then(function (res) {
        console.log('core status', res);
      }).catch(function (err) {
        console.error(err);
        // return reject(new errors.BadRequest());
      });
    }

    /**
     * [find description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */

  }, {
    key: 'find',
    value: function find(params) {
      if (!_utils._.has(params.query, '$suggest')) {
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

  }, {
    key: 'search',
    value: function search(params) {
      var _this = this;

      var _self = this;
      return new Promise(function (resolve, reject) {
        _this.Solr.json((0, _utils.queryJson)(params, _self.options)).then(function (res) {
          debug('Service.find', params, res);
          resolve((0, _utils.responseFind)(params, _self.options, res));
        }).catch(function (err) {
          debug('Service.find ERROR:', err);
          return reject(new _feathersErrors2.default.BadRequest(err));
        });
      });
    }

    /**
     * Suggest
     * @param  {object} params Query Object
     * @return {object}        Promise
     */

  }, {
    key: 'suggest',
    value: function suggest(params) {
      var _this2 = this;

      var _self = this;
      return new Promise(function (resolve, reject) {
        _this2.Solr.suggest((0, _utils.querySuggest)(params, _self.options)).then(function (res) {
          debug('Service.suggest', params, res);
          resolve(res);
        }).catch(function (err) {
          debug('Service.suggest ERROR:', err);
          return reject(new _feathersErrors2.default.BadRequest(err));
        });
      });
    }

    /**
     * [get description]
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */

  }, {
    key: 'get',
    value: function get(id, params) {
      var _this3 = this;

      var _self = this;

      params = Object.assign({ query: {} }, params, { $limit: 1, $skip: 0 });
      params.query[_self.options.idfield] = id;

      return new Promise(function (resolve, reject) {

        _this3.Solr.json((0, _utils.queryJson)(params, _self.options)).then(function (res) {
          var docs = (0, _utils.responseGet)(res);
          if (typeof docs !== 'undefined') {
            return resolve(docs);
          } else {
            return reject(new _feathersErrors2.default.NotFound('No record found for id \'' + id + '\''));
          }
        }).catch(function (err) {
          console.log('err', err);
          return reject(new _feathersErrors2.default.NotFound('No record found for id \'' + id + '\''));
        });
      });
    }

    /**
     * [create description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */

  }, {
    key: 'create',
    value: function create(data) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        _this4.Solr.update(data).then(function (res) {
          if (res.responseHeader.status === 0) {
            resolve(data);
          } else {
            console.log('res', res);
            return reject(new _feathersErrors2.default.BadRequest(res));
          }
        }).catch(function (err) {
          console.log('err', err);
          return reject(new _feathersErrors2.default.BadRequest(err));
        });
      });
    }

    /**
     * adapter.update(id, data, params) -> Promise
     * @param  {[type]} id     [description]
     * @param  {[type]} data   [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */

  }, {
    key: 'update',
    value: function update(id, data) {

      if (id === null || Array.isArray(data)) {
        return Promise.reject(new _feathersErrors2.default.BadRequest('You can not replace multiple instances. Did you mean \'patch\'?'));
      }

      var _self = this;
      data[_self.options.idfield] = id;

      return new Promise(function (resolve, reject) {
        _self.create(data).then(function () {
          resolve(data);
        }).catch(function (err) {
          debug('Service.update ERROR:', err);
          return reject(new _feathersErrors2.default.BadRequest(err));
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
     * Using update / overide the doc instead of atomic
     * field update http://yonik.com/solr/atomic-updates/
     * @param  {[type]} id     [description]
     * @param  {[type]} data   [description]
     * @param  {[type]} params [description]
     * @return {[type]}        [description]
     */

  }, {
    key: 'patch',
    value: function patch(id, data, params) {

      var _self = this;
      var query = { $limit: 1 };

      if (_utils._.has(params, 'query')) {
        query = params.query;
      }

      if (id !== null) {
        query[_self.options.idfield] = id;
      } else {
        query.$limit = 100000; // TODO: ?
      }

      return new Promise(function (resolve, reject) {

        _self.Solr.json((0, _utils.queryJson)({ query: query }, _self.options)).then(function (response) {

          response = (0, _utils.responseFind)(params, _self.options, response);

          if (response.data.length > 0) {

            response.data.forEach(function (doc, index) {
              Object.keys(data).forEach(function (key) {
                if (Array.isArray(response.data[index][key])) {
                  if (Array.isArray(data[key])) {
                    response.data[index][key] = response.data[index][key].concat(data[key]);
                  } else {
                    response.data[index][key].push(data[key]);
                  }
                } else {
                  response.data[index][key] = data[key];
                }
              });
              delete response.data[index]._version_;
            });

            _self.create(response.data).then(function (res) {
              if (id !== null && res.length === 1) {
                res = res[0];
              }
              resolve(res);
            }).catch(function (err) {
              debug('Service.patch crate ERROR:', err);
              return reject(new _feathersErrors2.default.BadRequest(err));
            });
          } else {
            resolve();
          }
        }).catch(function (err) {
          debug('Service.patch find ERROR:', err);
          return reject(new _feathersErrors2.default.BadRequest(err));
        });
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

  }, {
    key: 'remove',
    value: function remove(id, params) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {

        _this5.Solr.delete((0, _utils.queryDelete)(id, params || null)).then(function (res) {
          resolve(res);
        }).catch(function (err) {
          debug('Service.remove ERROR:', err);
          return reject(new _feathersErrors2.default.BadRequest(err));
        });
      });
    }

    /**
     * Get Solr Client and use additional functions
     * @return {[type]} [description]
     */

  }, {
    key: 'client',
    value: function client() {
      return this.Solr;
    }
  }]);

  return Service;
}();

function init(options) {
  return new Service(options);
}

init.Service = Service;
module.exports = exports['default'];