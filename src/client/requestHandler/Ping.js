/**
 * Solr Config API
 *
 * http://localhost:8983/solr/gettingstarted/admin/ping?wt=json
 * https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig
 */
export default (request, opts) => {

    let options = {
        method: 'GET',
        uri: opts.coreUrl + '/admin/ping',
        qs: {
            wt: 'json'
        },
        json: true
    };

    return request.get(options);
};