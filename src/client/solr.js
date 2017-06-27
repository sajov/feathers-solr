'use strict';

/**
  The entry point.
  @module Solr
**/
import * as BlobStoreApi from './requestHandler/BlobStoreApi.js';
import * as ConfigApi from './requestHandler/ConfigApi.js';
import CoreAdminApi from './requestHandler/CoreAdminApi.js';
import SchemaApi from './requestHandler/SchemaApi.js';
import JsonRequestApi from './requestHandler/JsonRequestApi.js';
import * as ManagedResources from './requestHandler/ManagedResources.js';
import Ping from './requestHandler/Ping.js';
import * as RealTime from './requestHandler/RealTime.js';
import * as ReplicationHandlers from './requestHandler/ReplicationHandlers.js';
import * as RequestParametersAPI from './requestHandler/RequestParametersAPI.js';
import SearchHandlers from './requestHandler/SearchHandlers.js';
import * as ShardHandlers from './requestHandler/ShardHandlers.js';
import * as UpdateRequestHandlers from './requestHandler/UpdateRequestHandlers.js';
var request = require('request-promise');

export default class Solr {

    constructor(opts) {

        this.opts = this.extend({
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

        this.req = request;
    }

    blob(params) {
        return new BlobStoreApi(this.req, this.opts, params);
    }

    commit(data) {
        return new UpdateRequestHandlers.commit(this.req, this.opts);
    }

    config(params) {
        return new ConfigApi(this.req, this.opts, params);
    }

    coreAdmin() {
        return new CoreAdminApi(this.req, this.opts);
    }

    delete(data) {
        return new UpdateRequestHandlers.deleteQuery(this.req, this.opts, data);
    }

    extend(... args) {
        return Object.assign(... args);
    }

    json(params) {
        return new JsonRequestApi(this.req, this.opts, params);
    }

    optimize(data) {
        return new UpdateRequestHandlers.optimize(this.req, this.opts);
    }

    ping() {
        return new Ping(this.req, this.opts);
    }

    real(params) {
        return new RealTime(this.req, this.opts, params);

    }

    resources(params) {
        return new ManagedResources(this.req, this.opts, params);
    }

    replication(params) {
        return new ReplicationHandlers(this.req, this.opts, params);
    }

    requestParametersAPI(params) {
        return new RequestParametersAPI(this.req, this.opts, params);
    }

    schema() {
        return new SchemaApi(this.req, this.opts);
    }

    search(params) {
        return new SearchHandlers(this.req, this.opts, params);
    }

    shard(params) {
        return new ShardHandlers(this.req, this.opts, params);
    }


    update(data) {
        return new UpdateRequestHandlers.update(this.req, this.opts, data);
    }

    updateJson(data) {
        return new UpdateRequestHandlers.updateJson(this.req, this.opts, data);
    }

    updateJsonDocs(data) {
        return new UpdateRequestHandlers.updateJsonDocs(this.req, this.opts, data);
    }



}