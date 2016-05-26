'use strict';

/**
  The entry point.
  @module Solr
  Solr.select();
  Solr.ConfigApi();
  Solr.ConfigApi.set();
  Solr.ConfigApi.get();
**/
import * as BlobStoreApi from './requestHandler/BlobStoreApi.js';
import * as ConfigApi from './requestHandler/ConfigApi.js';
import * as JsonRequestApi from './requestHandler/JsonRequestApi.js';
import * as ManagedResources from './requestHandler/ManagedResources.js';
import * as Ping from './requestHandler/Ping.js';
import * as RealTime from './requestHandler/RealTime.js';
import * as ReplicationHandlers from './requestHandler/ReplicationHandlers.js';
import * as RequestParametersAPI from './requestHandler/RequestParametersAPI.js';
import * as SearchHandlers from './requestHandler/SearchHandlers.js';
import * as ShardHandlers from './requestHandler/ShardHandlers.js';
import * as UpdateRequestHandlers from './requestHandler/UpdateRequestHandlers.js';


var request = require('request');

// BlobStoreApi.someMethod();
// ConfigApi.someMethod();
// JsonRequestApi.someMethod();
// ManagedResources.someMethod();
// Ping.someMethod();
// RealTime.someMethod();
// ReplicationHandlers.someMethod();
// RequestParametersAPI.someMethod();
// SearchHandlers.someMethod();
// ShardHandlers.someMethod();
// UpdateRequestHandlers.someMethod();



export default class Solr {

    constructor(opts) {
         console.log('Solr');
         this.opts = opts;
    }

    req(t) {
        console.log(t);
    }



    blob(params){
        return new BlobStoreApi(request, this.opts, params);
    }

    config(params){
        return new ConfigApi(request, this.opts, params);
    }

    json(params){
        return new JsonRequestApi(request, this.opts, params);
    }

    resources(params){
        return new ManagedResources(request, this.opts, params);
    }

    ping(params){
        return new Ping(request, this.opts, params);
    }

    real(params){
        return new RealTime(request, this.opts, params);
    }

    replication(params){
        return new ReplicationHandlers(request, this.opts, params);
    }

    RequestParametersAPI(params){
        return new RequestParametersAPI(request, this.opts, params);
    }

    search(params){
        return new SearchHandlers(request, this.opts, params);
    }

    shard(params){
        return new ShardHandlers(request, this.opts, params);
    }

    update(params){
        return new UpdateRequestHandlers(request, this.opts, params);
    }


}