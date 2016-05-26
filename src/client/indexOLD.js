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


exports.Solr = function(opts) {

    this.opts = opts;

    this.blob = function(params){
        return new BlobStoreApi(request, opts, params);
    };
    this.config = function(params){
        return new ConfigApi(request, opts, params);
    };
    this.json = function(params){
        return new JsonRequestApi(request, opts, params);
    };
    this.resources = function(params){
        return new ManagedResources(request, opts, params);
    };
    this.ping = function(params){
        return new Ping(request, opts, params);
    };
    this.real = function(params){
        return new RealTime(request, opts, params);
    };
    this.replication = function(params){
        return new ReplicationHandlers(request, opts, params);
    };
    this.RequestParametersAPI = function(params){
        return new RequestParametersAPI(request, opts, params);
    };
    this.search = function(params){
        return new SearchHandlers(request, opts, params);
    };
    this.shard = function(params){
        return new ShardHandlers(request, opts, params);
    };
    this.update = function(params){
        return new UpdateRequestHandlers(request, opts, params);
    };

};