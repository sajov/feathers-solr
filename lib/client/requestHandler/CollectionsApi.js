'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Solr Collections API
 * https://cwiki.apache.org/confluence/display/solr/Collections+API
 */
var CollectionsApi = function () {
    function CollectionsApi(request, opts) {
        _classCallCheck(this, CollectionsApi);

        this.options = {
            method: 'GET',
            uri: opts.url + '/admin/collections',
            json: true
        };

        this.request = request;
    }

    /* CREATE : create a collection  */


    _createClass(CollectionsApi, [{
        key: 'create',
        value: function create(params) {
            this.options.qs = Object.assign({
                action: 'CREATE'
            }, params);

            return this.request(this.options);
        }
        /* MODIFYCOLLECTION : Modify certain attributes of a collection  */

    }, {
        key: 'modifycollection',
        value: function modifycollection(params) {
            this.options.qs = Object.assign({
                action: 'MODIFYCOLLECTION'
            }, params);

            return this.request(this.options);
        }
        /* RELOAD : reload a collection */

    }, {
        key: 'reload',
        value: function reload(params) {
            this.options.qs = Object.assign({
                action: 'RELOAD'
            }, params);

            return this.request(this.options);
        }
        /* SPLITSHARD : split a shard into two new shards */

    }, {
        key: 'splitshard',
        value: function splitshard(params) {
            this.options.qs = Object.assign({
                action: 'SPLITSHARD'
            }, params);

            return this.request(this.options);
        }
        /* CREATESHARD : create a new shard */

    }, {
        key: 'createshard',
        value: function createshard(params) {
            this.options.qs = Object.assign({
                action: 'CREATESHARD'
            }, params);

            return this.request(this.options);
        }
        /* DELETESHARD : delete an inactive shard */

    }, {
        key: 'deleteshard',
        value: function deleteshard(params) {
            this.options.qs = Object.assign({
                action: 'DELETESHARD'
            }, params);

            return this.request(this.options);
        }
        /* CREATEALIAS : create or modify an alias for a collection */

    }, {
        key: 'createalias',
        value: function createalias(params) {
            this.options.qs = Object.assign({
                action: 'CREATEALIAS'
            }, params);

            return this.request(this.options);
        }
        /* DELETEALIAS : delete an alias for a collection */

    }, {
        key: 'deletealias',
        value: function deletealias(params) {
            this.options.qs = Object.assign({
                action: 'DELETEALIAS'
            }, params);

            return this.request(this.options);
        }
        /* DELETE : delete a collection */

    }, {
        key: 'delete',
        value: function _delete(params) {
            this.options.qs = Object.assign({
                action: 'DELETE'
            }, params);

            return this.request(this.options);
        }
        /* DELETEREPLICA : delete a replica of a shard */

    }, {
        key: 'deletereplica',
        value: function deletereplica(params) {
            this.options.qs = Object.assign({
                action: 'DELETEREPLICA'
            }, params);

            return this.request(this.options);
        }
        /* ADDREPLICA : add a replica of a shard */

    }, {
        key: 'addreplica',
        value: function addreplica(params) {
            this.options.qs = Object.assign({
                action: 'ADDREPLICA'
            }, params);

            return this.request(this.options);
        }
        /* CLUSTERPROP : Add/edit/delete a cluster-wide property  */

    }, {
        key: 'clusterprop',
        value: function clusterprop(params) {
            this.options.qs = Object.assign({
                action: 'CLUSTERPROP'
            }, params);

            return this.request(this.options);
        }
        /* MIGRATE : Migrate documents to another collection  */

    }, {
        key: 'migrate',
        value: function migrate(params) {
            this.options.qs = Object.assign({
                action: 'MIGRATE'
            }, params);

            return this.request(this.options);
        }
        /* ADDROLE : Add a specific role to a node in the cluster  */

    }, {
        key: 'addrole',
        value: function addrole(params) {
            this.options.qs = Object.assign({
                action: 'ADDROLE'
            }, params);

            return this.request(this.options);
        }
        /* REMOVEROLE : Remove an assigned role  */

    }, {
        key: 'removerole',
        value: function removerole(params) {
            this.options.qs = Object.assign({
                action: 'REMOVEROLE'
            }, params);

            return this.request(this.options);
        }
        /* OVERSEERSTATUS : Get status and statistics of the overseer  */

    }, {
        key: 'overseerstatus',
        value: function overseerstatus(params) {
            this.options.qs = Object.assign({
                action: 'OVERSEERSTATUS'
            }, params);

            return this.request(this.options);
        }
        /* CLUSTERSTATUS : Get cluster status  */

    }, {
        key: 'clusterstatus',
        value: function clusterstatus(params) {
            this.options.qs = Object.assign({
                action: 'CLUSTERSTATUS'
            }, params);

            return this.request(this.options);
        }
        /* REQUESTSTATUS : Get the status of a previous asynchronous request */

    }, {
        key: 'requeststatus',
        value: function requeststatus(params) {
            this.options.qs = Object.assign({
                action: 'REQUESTSTATUS'
            }, params);

            return this.request(this.options);
        }
        /* DELETESTATUS : Delete the stored response of a previous asynchronous request */

    }, {
        key: 'deletestatus',
        value: function deletestatus(params) {
            this.options.qs = Object.assign({
                action: 'DELETESTATUS'
            }, params);

            return this.request(this.options);
        }
        /* LIST : List all collections  */

    }, {
        key: 'list',
        value: function list(params) {
            this.options.qs = Object.assign({
                action: 'LIST'
            }, params);

            return this.request(this.options);
        }
        /* ADDREPLICAPROP : Add an arbitrary property to a replica specified by collection/shard/replica  */

    }, {
        key: 'addreplicaprop',
        value: function addreplicaprop(params) {
            this.options.qs = Object.assign({
                action: 'ADDREPLICAPROP'
            }, params);

            return this.request(this.options);
        }
        /* DELETEREPLICAPROP : Delete an arbitrary property from a replica specified by collection/shard/replica  */

    }, {
        key: 'deletereplicaprop',
        value: function deletereplicaprop(params) {
            this.options.qs = Object.assign({
                action: 'DELETEREPLICAPROP'
            }, params);

            return this.request(this.options);
        }
        /* BALANCESHARDUNIQUE : Distribute an arbitrary property, one per shard, across the nodes in a collection */

    }, {
        key: 'balanceshardunique',
        value: function balanceshardunique(params) {
            this.options.qs = Object.assign({
                action: 'BALANCESHARDUNIQUE'
            }, params);

            return this.request(this.options);
        }
        /* REBALANCELEADERS : Distribute leader role  based on the "preferredLeader" assignments */

    }, {
        key: 'rebalanceleaders',
        value: function rebalanceleaders(params) {
            this.options.qs = Object.assign({
                action: 'REBALANCELEADERS'
            }, params);

            return this.request(this.options);
        }
        /* FORCELEADER : Force a leader election in a shard if leader is lost  */

    }, {
        key: 'forceleader',
        value: function forceleader(params) {
            this.options.qs = Object.assign({
                action: 'FORCELEADER'
            }, params);

            return this.request(this.options);
        }
        /* MIGRATESTATEFORMAT : Migrate a collection from shared clusterstate.json to per-collection state.json */

    }, {
        key: 'migratestateformat',
        value: function migratestateformat(params) {
            this.options.qs = Object.assign({
                action: 'MIGRATESTATEFORMAT'
            }, params);

            return this.request(this.options);
        }
    }]);

    return CollectionsApi;
}();

exports.default = CollectionsApi;
module.exports = exports.default;