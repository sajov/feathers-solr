'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.update = update;
exports.updateJson = updateJson;
exports.updateJsonDocs = updateJsonDocs;
exports.deleteQuery = deleteQuery;
exports.commit = commit;
exports.optimize = optimize;
/**
 * Solr Config API
 * https://cwiki.apache.org/confluence/display/solr/Uploading+Data+with+Index+Handlers#UploadingDatawithIndexHandlers-JSONFormattedIndexUpdates
 *
 *  curl -X POST -H 'Content-Type: application/json' 'http://localhost:8983/solr/my_collection/update' --data-binary '
 *  {
 *    "add": {
 *      "doc": {
 *        "id": "DOC1",
 *        "my_boosted_field": {        // use a map with boost/value for a boosted field //
 *          "boost": 2.3,
 *          "value": "test"
 *        },
 *        "my_multivalued_field": [ "aaa", "bbb" ]   // Can use an array for a multi-valued field //
 *      }
 *    },
 *    "add": {
 *      "commitWithin": 5000,          // commit this document within 5 seconds //
 *      "overwrite": false,            // don't check for existing documents with the same uniqueKey //
 *      "boost": 3.45,                 // a document boost //
 *      "doc": {
 *        "f1": "v1",                  // Can use repeated keys for a multi-valued field //
 *        "f1": "v2"
 *      }
 *    },
 *
 *    "commit": {},
 *    "optimize": { "waitSearcher":false },
 *
 *    "delete": { "id":"ID" },         // delete by ID
 *    "delete": { "query":"QUERY" }    // delete by query
 *  }'
 */

function update(request, opts, data) {

    var options = {
        method: 'POST',
        uri: opts.coreUrl + '/update/json/docs', // '/update/json' || /update/json/docs
        qs: {
            wt: 'json',
            softCommit: true, // softCommit: true, commit: true, commitWithin: 50
            commitWithin: 50000,
            overwrite: true
        },
        body: data,
        json: true
    };

    if (Array.isArray(data)) {
        options.uri = opts.coreUrl + '/update';
    }

    // console.log('UpdateRequestHandler.update options',options);
    // console.log('UpdateRequestHandler.update data',data);
    return request(options);
}

function updateJson(request, opts, data) {

    var options = {
        method: 'POST',
        uri: opts.coreUrl + '/update/json', // '/update/json' || /update/json/docs
        qs: {
            wt: 'json',
            softCommit: true, // softCommit: true, commit: true, commitWithin: 50
            commitWithin: 50000,
            overwrite: true
        },
        body: data,
        json: true
    };
    // console.log('UpdateRequestHandler updateJson',options);
    return request(options);
}

function updateJsonDocs(request, opts, data) {

    var options = {
        method: 'POST',
        uri: opts.coreUrl + '/update/json/docs', // '/update/json' || /update/json/docs
        qs: {
            wt: 'json',
            softCommit: true, // softCommit: true, commit: true, commitWithin: 50
            commitWithin: 50000,
            overwrite: true
        },
        body: data,
        json: true
    };

    return request(options);
}

function deleteQuery(request, opts, query) {
    var options = {
        method: 'POST',
        uri: opts.coreUrl + '/update', // '/update/json' || /update/json/docs
        qs: Object.assign({
            wt: 'json',
            softCommit: true, // softCommit: true, commit: true, commitWithin: 50
            commitWithin: 50000
        }, opts.commitStrategy || {}),
        body: query,
        json: true
    };
    // console.log('UpdateRequestHandler deleteQuery',options, options.body);
    return request(options);
}

function commit(request, opts) {
    var options = {
        method: 'POST',
        uri: opts.coreUrl + '/update', // '/update/json' || /update/json/docs
        qs: {
            wt: 'json',
            commit: true // softCommit: true, commit: true, commitWithin: 50
        },
        json: true
    };

    return request(options);
}

function optimize(request, opts) {
    var options = {
        method: 'POST',
        uri: opts.coreUrl + '/update', // '/update/json' || /update/json/docs
        qs: {
            wt: 'json',
            optimize: true // softCommit: true, commit: true, commitWithin: 50
        },
        json: true
    };

    return request(options);
}