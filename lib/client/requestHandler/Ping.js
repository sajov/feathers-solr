'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

/**
 * Solr Config API
 *
 * http://localhost:8983/solr/gettingstarted/admin/ping?wt=json
 * https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig
 */
exports.default = function (request, opts) {

    var options = {
        method: 'GET',
        uri: opts.coreUrl + '/admin/ping',
        qs: {
            wt: 'json'
        },
        json: true
    };

    return request.get(options);
};

module.exports = exports['default'];