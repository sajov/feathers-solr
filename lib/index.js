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
    var _this = this;

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
      /*commitStrategy softCommit: true, commit: true, commitWithin: 50000*/
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

    this.status().then(function () {
      _this.describe().then(function () {
        _this.define().catch(function (err) {
          debug('Service.define Error:', err);
        });
      }).catch(function (err) {
        debug('Service.describe Error:', err);
      });
    }).catch(function (err) {
      debug('Service.status Error:', err);
    });
  }

  /**
   * Describe Solr Schema
   * @return {object]} Solr Schema
   */


  _createClass(Service, [{
    key: 'describe',
    value: function describe() {
      return (0, _utils.describeSchema)(this);
    }

    /**
     * Define Sole Schema
     * @param  {object} params Schema Filds
     * @return {[type]}
     */

  }, {
    key: 'define',
    value: function define(schema) {
      this.options.schema = Object.assign({}, this.options.schema, schema);
      return (0, _utils.defineSchema)(this);
    }

    /**
     * Solr Status
     * @return {object} Solr Status
     */

  }, {
    key: 'status',
    value: function status() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.Solr.coreAdmin().status().then(function (res) {
          resolve(res);
        }).catch(function (err) {
          return reject(new _feathersErrors2.default.BadRequest(err));
        });
      });
    }

    /**
     * Adapter Find Method
     * @param  {[type]} params User Query
     * @return {[type]}        Promise
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
     * Adapter Custom Search Method
     * @param  {object} params User Query
     * @return {object}        Promise
     */

  }, {
    key: 'search',
    value: function search(params) {
      var _this3 = this;

      var _self = this;
      return new Promise(function (resolve, reject) {
        _this3.Solr.json((0, _utils.queryJson)(params, _self.options)).then(function (res) {
          debug('Service.find', params, res);
          resolve((0, _utils.responseFind)(params, _self.options, res));
        }).catch(function (err) {
          debug('Service.find ERROR:', err);
          return reject(new _feathersErrors2.default.BadRequest(err));
        });
      });
    }

    /**
     * Adapter Custom Suggest Method
     * @param  {object} params Query Object
     * @return {object}        Promise
     */

  }, {
    key: 'suggest',
    value: function suggest(params) {
      var _this4 = this;

      var _self = this;
      return new Promise(function (resolve, reject) {
        _this4.Solr.suggest((0, _utils.querySuggest)(params, _self.options)).then(function (res) {
          debug('Service.suggest', params, res);
          resolve(res);
        }).catch(function (err) {
          debug('Service.suggest ERROR:', err);
          return reject(new _feathersErrors2.default.BadRequest(err));
        });
      });
    }

    /**
       * Adapter Get Method
       * @param  {[type]} params User Query
       * @return {[type]}        Promise
       */

  }, {
    key: 'get',
    value: function get(id, params) {
      var _this5 = this;

      var _self = this;

      params = Object.assign({ query: {} }, params, { $limit: 1, $skip: 0 });
      params.query[_self.options.idfield] = id;

      return new Promise(function (resolve, reject) {

        _this5.Solr.json((0, _utils.queryJson)(params, _self.options)).then(function (res) {
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
       * Adapter Create Method
       * @param  {[type]} params User Query
       * @return {[type]}        Promise
       */

  }, {
    key: 'create',
    value: function create(data) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        _this6.Solr.update(data).then(function (res) {
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
     * Adapter Find Method
     * adapter.update(id, data, params) -> Promise
     *
     * @param  {mixed}  id     [description]
     * @param  {object} data   Update Data
     * @param  {object} params User Query
     * @return {object}        Promise
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

  }, {
    key: 'patch',
    value: function patch(id, data, params) {
      var _self = this;

      return new Promise(function (resolve, reject) {

        if (id === null && (!_utils._.isObject(params) || _utils._.isEmpty(params))) {
          return reject(new _feathersErrors2.default.BadRequest('Missing Params'));
        }
        var patchData = (0, _utils.queryPatch)(data);
        var createData = [];
        if (id !== null) {
          patchData[_self.options.idfield] = id;
          createData.push(patchData);
          _self.create(createData).then(function (res) {
            return resolve(createData);
          }).catch(function (err) {
            return reject(new _feathersErrors2.default.BadRequest(err));
          });
        } else {
          var query = params.query || {};
          query.$select = [_self.options.idfield];
          _self.Solr.json((0, _utils.queryJson)({ query: query }, _self.options)).then(function (response) {
            response = (0, _utils.responseFind)(query, _self.options, response);
            if (response.data.length > 0) {
              response.data.forEach(function (doc, index) {
                var ref = {};
                ref[_self.options.idfield] = doc[_self.options.idfield];
                createData.push(Object.assign({}, patchData, ref));
              });
              _self.create(createData).then(function (res) {
                return resolve(createData);
              }).catch(function (err) {
                return reject(new _feathersErrors2.default.BadRequest(err));
              });
            } else {
              return resolve(createData);
            }
          }).catch(function (err) {
            debug('Service.patch find ERROR:', err);
            return reject(new _feathersErrors2.default.BadRequest(err));
          });
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

  }, {
    key: 'remove',
    value: function remove(id, params) {
      var _this7 = this;

      return new Promise(function (resolve, reject) {

        _this7.Solr.delete((0, _utils.queryDelete)(id, params || null)).then(function (res) {
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
module.exports = exports.default;