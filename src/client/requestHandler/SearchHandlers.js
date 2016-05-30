/**
 * Solr Config API
 * https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig
 */
export default (request, opts, query) => {

    query = Object.assign({
                wt: 'json',
                q: '*:*'
            }, query ,{});

    let options = {
        method: 'GET',
        uri: opts.coreUrl + '/select', // '/update/json' || /update/json/docs
        qs: Object.assign({
            wt: 'json',
            q: '*:*'
        }, query),
        qsStringifyOptions: {
            arrayFormat:'repeat'
        },
        json: true
    };
    // console.log('SearchHandlers OPTIONS',options);
    return request(options);
};