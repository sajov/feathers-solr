'use strict';

/**
  The entry point.
  @module Solr
**/
import * as BlobStoreApi from './requestHandler/BlobStoreApi.js';
import * as ConfigApi from './requestHandler/ConfigApi.js';
import * as JsonRequestApi from './requestHandler/JsonRequestApi.js';
import * as ManagedResources from './requestHandler/ManagedResources.js';
import Ping from './requestHandler/Ping.js';
import * as RealTime from './requestHandler/RealTime.js';
import * as ReplicationHandlers from './requestHandler/ReplicationHandlers.js';
import * as RequestParametersAPI from './requestHandler/RequestParametersAPI.js';
import SearchHandlers from './requestHandler/SearchHandlers.js';
import * as ShardHandlers from './requestHandler/ShardHandlers.js';
import UpdateRequestHandlers from './requestHandler/UpdateRequestHandlers.js';
var request = require('request-promise');

export default class Solr {

    constructor(opts) {

        this.opts = this.extend({
            scheme:'http',
            host:'localhost',
            port:8983,
            path:'/solr',
            core:'/gettingstarted',
            createUUID: true,
            commitType: {commitWihtin:50}, // mixed: true||'softCommit'||{commitWihtin:50}
            managedScheme: true,
        }, opts);

        this.opts.url = [this.opts.scheme, '://', this.opts.host, ':', this.opts.port, this.opts.path].join('');
        this.opts.coreUrl = [this.opts.url, this.opts.core].join('');
        this.req = request;

    }

    extend(... args) {
        return Object.assign(... args);
    }

    blob(params){
        return new BlobStoreApi(this.req, this.opts, params);
    }

    config(params){
        return new ConfigApi(this.req, this.opts, params);
    }

    json(params){
        return new JsonRequestApi(this.req, this.opts, params);
    }

    resources(params){
        return new ManagedResources(this.req, this.opts, params);
    }

    ping(){
        return new Ping(this.req, this.opts);
    }

    real(params){
        return new RealTime(this.req, this.opts, params);
    }

    replication(params){
        return new ReplicationHandlers(this.req, this.opts, params);
    }

    requestParametersAPI(params){
        return new RequestParametersAPI(this.req, this.opts, params);
    }

    search(params){
        return new SearchHandlers(this.req, this.opts, params);
    }

    shard(params){
        return new ShardHandlers(this.req, this.opts, params);
    }

    update(data){
        return new UpdateRequestHandlers(this.req, this.opts, data);
    }
}