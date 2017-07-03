'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BlobStoreApi = require('./requestHandler/BlobStoreApi.js');

var BlobStoreApi = _interopRequireWildcard(_BlobStoreApi);

var _ConfigApi = require('./requestHandler/ConfigApi.js');

var _ConfigApi2 = _interopRequireDefault(_ConfigApi);

var _CollectionsApi = require('./requestHandler/CollectionsApi.js');

var _CollectionsApi2 = _interopRequireDefault(_CollectionsApi);

var _ConfigSetsApi = require('./requestHandler/ConfigSetsApi.js');

var _ConfigSetsApi2 = _interopRequireDefault(_ConfigSetsApi);

var _CoreAdminApi = require('./requestHandler/CoreAdminApi.js');

var _CoreAdminApi2 = _interopRequireDefault(_CoreAdminApi);

var _JsonRequestApi = require('./requestHandler/JsonRequestApi.js');

var _JsonRequestApi2 = _interopRequireDefault(_JsonRequestApi);

var _ManagedResources = require('./requestHandler/ManagedResources.js');

var ManagedResources = _interopRequireWildcard(_ManagedResources);

var _Ping = require('./requestHandler/Ping.js');

var _Ping2 = _interopRequireDefault(_Ping);

var _RealTime = require('./requestHandler/RealTime.js');

var RealTime = _interopRequireWildcard(_RealTime);

var _ReplicationHandlers = require('./requestHandler/ReplicationHandlers.js');

var ReplicationHandlers = _interopRequireWildcard(_ReplicationHandlers);

var _RequestParametersAPI = require('./requestHandler/RequestParametersAPI.js');

var RequestParametersAPI = _interopRequireWildcard(_RequestParametersAPI);

var _SchemaApi = require('./requestHandler/SchemaApi.js');

var _SchemaApi2 = _interopRequireDefault(_SchemaApi);

var _SearchHandlers = require('./requestHandler/SearchHandlers.js');

var _SearchHandlers2 = _interopRequireDefault(_SearchHandlers);

var _ShardHandlers = require('./requestHandler/ShardHandlers.js');

var ShardHandlers = _interopRequireWildcard(_ShardHandlers);

var _SuggestHandlers = require('./requestHandler/SuggestHandlers.js');

var _SuggestHandlers2 = _interopRequireDefault(_SuggestHandlers);

var _UpdateRequestHandlers = require('./requestHandler/UpdateRequestHandlers.js');

var UpdateRequestHandlers = _interopRequireWildcard(_UpdateRequestHandlers);

var _requestPromise = require('request-promise');

var _requestPromise2 = _interopRequireDefault(_requestPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A Solr Rest Adapter for full Managed Solr ENV
 * @module Solr Adapter
 */
var Solr = function () {

    /**
     * Set up Solr Adapter
     * @constructor
     */
    function Solr(opts) {
        _classCallCheck(this, Solr);

        this.opts = Object.assign({
            host: 'http://localhost:8983/solr',
            core: '/gettingstarted',
            managedScheme: true,
            commitStrategy: {
                softCommit: true,
                commitWithin: 50000,
                overwrite: true
            }
        }, opts);

        this.opts.url = this.opts.host;

        this.opts.coreUrl = this.opts.host + this.opts.core;

        this.req = _requestPromise2.default;
    }

    /**
     * [Solr Blob Api](https://cwiki.apache.org/confluence/display/solr/Blob+Store+API)  Interface
     * @method
     * @param  {object} params Params
     * @return {object}        Promise
     */


    _createClass(Solr, [{
        key: 'blob',
        value: function blob(params) {
            return new BlobStoreApi(this.req, this.opts, params);
        }

        /**
         * Solr Collections API
         * [Solr Docs](https://cwiki.apache.org/confluence/display/solr/Collections+API)  Interface
         * @method
         * @param  {object} params Params
         * @return {object}        Promise
         */

    }, {
        key: 'collections',
        value: function collections(params) {
            return new _CollectionsApi2.default(this.req, this.opts, params);
        }
    }, {
        key: 'configSets',
        value: function configSets(params) {
            return new _CollectionsApi2.default(this.req, this.opts, params);
        }
    }, {
        key: 'commit',
        value: function commit(data) {
            return new UpdateRequestHandlers.commit(this.req, this.opts);
        }
    }, {
        key: 'config',
        value: function config(params) {
            return new _ConfigApi2.default(this.req, this.opts, params);
        }
    }, {
        key: 'coreAdmin',
        value: function coreAdmin() {
            return new _CoreAdminApi2.default(this.req, this.opts);
        }
    }, {
        key: 'delete',
        value: function _delete(data) {
            return new UpdateRequestHandlers.deleteQuery(this.req, this.opts, data);
        }
    }, {
        key: 'json',
        value: function json(params) {
            return new _JsonRequestApi2.default(this.req, this.opts, params);
        }
    }, {
        key: 'suggest',
        value: function suggest(params) {
            return new _SuggestHandlers2.default(this.req, this.opts, params);
        }
    }, {
        key: 'optimize',
        value: function optimize(data) {
            return new UpdateRequestHandlers.optimize(this.req, this.opts);
        }
    }, {
        key: 'ping',
        value: function ping() {
            return new _Ping2.default(this.req, this.opts);
        }
    }, {
        key: 'real',
        value: function real(params) {
            return new RealTime(this.req, this.opts, params);
        }
    }, {
        key: 'resources',
        value: function resources(params) {
            return new ManagedResources(this.req, this.opts, params);
        }
    }, {
        key: 'replication',
        value: function replication(params) {
            return new ReplicationHandlers(this.req, this.opts, params);
        }
    }, {
        key: 'requestParameters',
        value: function requestParameters(params) {
            return new RequestParametersAPI(this.req, this.opts, params);
        }
    }, {
        key: 'schema',
        value: function schema() {
            return new _SchemaApi2.default(this.req, this.opts);
        }
    }, {
        key: 'search',
        value: function search(params) {
            return new _SearchHandlers2.default(this.req, this.opts, params);
        }
    }, {
        key: 'shard',
        value: function shard(params) {
            return new ShardHandlers(this.req, this.opts, params);
        }
    }, {
        key: 'update',
        value: function update(data) {
            return new UpdateRequestHandlers.update(this.req, this.opts, data);
        }
    }, {
        key: 'updateJson',
        value: function updateJson(data) {
            return new UpdateRequestHandlers.updateJson(this.req, this.opts, data);
        }
    }, {
        key: 'updateJsonDocs',
        value: function updateJsonDocs(data) {
            return new UpdateRequestHandlers.updateJsonDocs(this.req, this.opts, data);
        }
    }]);

    return Solr;
}();

exports.default = Solr;
module.exports = exports['default'];