/**
 * Solr Collections API
 * https://cwiki.apache.org/confluence/display/solr/Collections+API
 */

export class CollectionsApi {

    constructor(request, opts) {

        this.options = {
            method: 'GET',
            uri: opts.url + '/admin/collections',
            json: true
        };

        this.request = request;
    }

    /* CREATE : create a collection  */
    create(params) {
        this.options.qs = Object.assing({
            action: 'CREATE',
        }, params);

        return this.request(this.options);
    }
    /* MODIFYCOLLECTION : Modify certain attributes of a collection  */
    modifycollection(params) {
        this.options.qs = Object.assing({
            action: 'MODIFYCOLLECTION',
        }, params);

        return this.request(this.options);
    }
    /* RELOAD : reload a collection */
    reload(params) {
        this.options.qs = Object.assing({
            action: 'RELOAD',
        }, params);

        return this.request(this.options);
    }
    /* SPLITSHARD : split a shard into two new shards */
    splitshard(params) {
        this.options.qs = Object.assing({
            action: 'SPLITSHARD',
        }, params);

        return this.request(this.options);
    }
    /* CREATESHARD : create a new shard */
    createshard(params) {
        this.options.qs = Object.assing({
            action: 'CREATESHARD',
        }, params);

        return this.request(this.options);
    }
    /* DELETESHARD : delete an inactive shard */
    deleteshard(params) {
        this.options.qs = Object.assing({
            action: 'DELETESHARD',
        }, params);

        return this.request(this.options);
    }
    /* CREATEALIAS : create or modify an alias for a collection */
    createalias(params) {
        this.options.qs = Object.assing({
            action: 'CREATEALIAS',
        }, params);

        return this.request(this.options);
    }
    /* DELETEALIAS : delete an alias for a collection */
    deletealias(params) {
        this.options.qs = Object.assing({
            action: 'DELETEALIAS',
        }, params);

        return this.request(this.options);
    }
    /* DELETE : delete a collection */
    delete(params) {
        this.options.qs = Object.assing({
            action: 'DELETE',
        }, params);

        return this.request(this.options);
    }
    /* DELETEREPLICA : delete a replica of a shard */
    deletereplica(params) {
        this.options.qs = Object.assing({
            action: 'DELETEREPLICA',
        }, params);

        return this.request(this.options);
    }
    /* ADDREPLICA : add a replica of a shard */
    addreplica(params) {
        this.options.qs = Object.assing({
            action: 'ADDREPLICA',
        }, params);

        return this.request(this.options);
    }
    /* CLUSTERPROP : Add/edit/delete a cluster-wide property  */
    clusterprop(params) {
        this.options.qs = Object.assing({
            action: 'CLUSTERPROP',
        }, params);

        return this.request(this.options);
    }
    /* MIGRATE : Migrate documents to another collection  */
    migrate(params) {
        this.options.qs = Object.assing({
            action: 'MIGRATE',
        }, params);

        return this.request(this.options);
    }
    /* ADDROLE : Add a specific role to a node in the cluster  */
    addrole(params) {
        this.options.qs = Object.assing({
            action: 'ADDROLE',
        }, params);

        return this.request(this.options);
    }
    /* REMOVEROLE : Remove an assigned role  */
    removerole(params) {
        this.options.qs = Object.assing({
            action: 'REMOVEROLE',
        }, params);

        return this.request(this.options);
    }
    /* OVERSEERSTATUS : Get status and statistics of the overseer  */
    overseerstatus(params) {
        this.options.qs = Object.assing({
            action: 'OVERSEERSTATUS',
        }, params);

        return this.request(this.options);
    }
    /* CLUSTERSTATUS : Get cluster status  */
    clusterstatus(params) {
        this.options.qs = Object.assing({
            action: 'CLUSTERSTATUS',
        }, params);

        return this.request(this.options);
    }
    /* REQUESTSTATUS : Get the status of a previous asynchronous request */
    requeststatus(params) {
        this.options.qs = Object.assing({
            action: 'REQUESTSTATUS',
        }, params);

        return this.request(this.options);
    }
    /* DELETESTATUS : Delete the stored response of a previous asynchronous request */
    deletestatus(params) {
        this.options.qs = Object.assing({
            action: 'DELETESTATUS',
        }, params);

        return this.request(this.options);
    }
    /* LIST : List all collections  */
    list(params) {
        this.options.qs = Object.assing({
            action: ':',
        }, params);

        return this.request(this.options);
    }
    /* ADDREPLICAPROP : Add an arbitrary property to a replica specified by collection/shard/replica  */
    addreplicaprop(params) {
        this.options.qs = Object.assing({
            action: 'ADDREPLICAPROP',
        }, params);

        return this.request(this.options);
    }
    /* DELETEREPLICAPROP : Delete an arbitrary property from a replica specified by collection/shard/replica  */
    deletereplicaprop(params) {
        this.options.qs = Object.assing({
            action: 'DELETEREPLICAPROP',
        }, params);

        return this.request(this.options);
    }
    /* BALANCESHARDUNIQUE : Distribute an arbitrary property, one per shard, across the nodes in a collection */
    balanceshardunique(params) {
        this.options.qs = Object.assing({
            action: 'BALANCESHARDUNIQUE',
        }, params);

        return this.request(this.options);
    }
    /* REBALANCELEADERS : Distribute leader role  based on the "preferredLeader" assignments */
    rebalanceleaders(params) {
        this.options.qs = Object.assing({
            action: 'REBALANCELEADERS',
        }, params);

        return this.request(this.options);
    }
    /* FORCELEADER : Force a leader election in a shard if leader is lost  */
    forceleader(params) {
        this.options.qs = Object.assing({
            action: 'FORCELEADER',
        }, params);

        return this.request(this.options);
    }
    /* MIGRATESTATEFORMAT : Migrate a collection from shared clusterstate.json to per-collection state.json */
    migratestateformat(params) {
        this.options.qs = Object.assing({
            action: 'MIGRATESTATEFORMAT',
        }, params);

        return this.request(this.options);
    }
}

