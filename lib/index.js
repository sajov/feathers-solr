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

if (!global._babelPolyfill) {
    require('babel-polyfill');
}

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

        debug('Initializing feathers-solr Service');

        var _self = this;

        _self.describe().then(function (res) {
            _self.options._schema = (0, _utils.parseSchemaFields)(res.fields);
            _self.define().then(function (res) {
                debug('feather-solr Service started', _self.options.commitStrategy || {
                    softCommit: true,
                    commitWithin: 50000,
                    overwrite: true
                }, res);
            }).catch(function (err) {
                debug('Service.define ERROR', err);
            });
        }).catch(function (err) {
            debug('Service.describe ERROR', err);
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
         * [define description]
         * @param  {[type]} fields [description]
         * @return {[type]}        [description]
         */

    }, {
        key: 'define',
        value: function define(fields) {
            var _this = this;

            var schemaApi = this.Solr.schema();
            var _self = this;

            return new Promise(function (resolve, reject) {

                if (_utils._.isObject(fields)) {
                    _self.options.schema = fields;
                }

                if (!_self.options.migrate === 'safe' || _self.options.managedScheme === false || _utils._.isObject(_self.options.schema) === false) {
                    return true;
                }
                debug('feathers-solr migrate start');

                if (_self.options.migrate === 'drop') {

                    _this.remove().then(function (res) {
                        debug('feathers-solr migrate drop data');

                        schemaApi.deleteField((0, _utils.deleteSchemaFields)(_self.options.schema)) ///
                        .then(function (res) {
                            debug('feathers-solr migrate reset schema', res);
                            schemaApi.addField((0, _utils.describeSchemaFields)(_self.options.schema)).then(function (res) {
                                debug('feathers-solr migrate define schema', res.errors);
                                resolve(res);
                            }).catch(function (err) {
                                debug('Service.define addField ERROR:', err);
                                return reject(new _feathersErrors2.default.BadRequest(err));
                            });
                        }).catch(function (err) {
                            debug('Service.define removeField ERROR:', err);
                            return reject(new _feathersErrors2.default.BadRequest(err));
                        });
                    }).catch(function (err) {
                        debug('Service.define remove ERROR:', err);
                        return reject(new _feathersErrors2.default.BadRequest(err));
                    });
                } else {
                    /* define fields */
                    schemaApi.addField((0, _utils.describeSchemaFields)(_self.options.schema)).then(function (res) {
                        debug('feathers-solr migrate define schema');
                        resolve(res);
                    }).catch(function (err) {
                        debug('Service.define addField ERROR:', err);
                        return reject(new _feathersErrors2.default.BadRequest(err));
                    });
                }
            });
        }

        /**
         * [describe description]
         * @return {[type]} [description]
         */

    }, {
        key: 'describe',
        value: function describe() {
            var _self = this;
            var schemaApi = _self.Solr.schema();
            return new Promise(function (resolve, reject) {
                schemaApi.fields().then(function (res) {
                    debug('feathers-solr describe');
                    resolve(res);
                }).catch(function (err) {
                    debug('Service.find ERROR:', err);
                    return reject(new _feathersErrors2.default.BadRequest(err));
                });
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
            var _this2 = this;

            var _self = this;
            return new Promise(function (resolve, reject) {
                _this2.Solr.json((0, _utils.queryJson)(params, _self.options)).then(function (res) {
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
            var _this3 = this;

            var _self = this;
            return new Promise(function (resolve, reject) {
                _this3.Solr.suggest((0, _utils.querySuggest)(params, _self.options)).then(function (res) {
                    debug('Service.find', params, res);
                    resolve(res);
                }).catch(function (err) {
                    debug('Service.find ERROR:', err);
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
        value: function get(id) {
            var _this4 = this;

            var _self = this;
            debug('Service.get(id)', id);
            // console.log(queryJson({query:{id: id}}),'get ????');
            return new Promise(function (resolve, reject) {
                _this4.Solr.json((0, _utils.queryJson)({ query: { id: id } })).then(function (res) {
                    var docs = (0, _utils.responseGet)(res);
                    // console.log('docs',docs);
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
            var _this5 = this;

            var _self = this;
            return new Promise(function (resolve, reject) {
                _this5.Solr.update(data).then(function (res) {
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
            data.id = id;

            return new Promise(function (resolve, reject) {
                _self.create(data).then(function (res) {
                    resolve(data);
                }).catch(function (err) {
                    console.log('err', err);
                    return reject(new _feathersErrors2.default.BadRequest());
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

    }, {
        key: 'patch',
        value: function patch(id, data, params) {

            var _self = this;
            var query = {};

            if (_utils._.has(params, 'query')) {
                query = params.query;
            }

            if (id !== null) {
                query = { id: id, $limit: 1 };
            } else {
                query.$limit = 100000; // TODO: ?
            }

            return new Promise(function (resolve, reject) {

                _self.Solr.json((0, _utils.queryJson)({ query: query }, _self.options)).then(function (response) {

                    response = (0, _utils.responseFind)(params, _self.options, response);

                    if (response.data.length > 0) {

                        response.data.forEach(function (doc, index, ref) {
                            Object.keys(data).forEach(function (key) {
                                if (Array.isArray(response.data[index][key])) {
                                    response.data[index][key].push(data[key]);
                                } else {
                                    response.data[index][key] = data[key];
                                }
                            });
                            delete response.data[index]._version_;
                        });

                        _self.create(response.data).then(function (res) {
                            resolve(res);
                        }).catch(function (err) {
                            console.log('err', err);
                            return reject(new _feathersErrors2.default.BadRequest());
                        });
                    } else {
                        resolve();
                    }
                }).catch(function (err) {
                    console.log('err', err);
                    return reject(new _feathersErrors2.default.BadRequest());
                });
            });
        }

        /**
         * Remove Data
         * @param  {[type]} id     [description]
         * @param  {[type]} params [description]
         * @return {[type]}        [description]
         */

    }, {
        key: 'remove',
        value: function remove(id, params) {
            var _this6 = this;

            var _self = this;
            return new Promise(function (resolve, reject) {
                _this6.Solr.delete((0, _utils.queryDelete)(id || null, params || {})).then(function (res) {
                    resolve(res);
                }).catch(function (err) {
                    return reject(new _feathersErrors2.default.BadRequest());
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