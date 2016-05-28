/**
 * Solr Config API
 * https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig
 */
export default (request, opts, query) => {

    let options = {
        method: 'GET',
        uri: opts.coreUrl + '/select', // '/update/json' || /update/json/docs
        qs: Object.assign({
            wt: 'json',
            q: '*:*'
        }, query),
        json: true
    };

    return request(options);
};