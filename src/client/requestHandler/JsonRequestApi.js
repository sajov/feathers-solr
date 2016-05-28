/**
 * Solr Config API
 * https://cwiki.apache.org/confluence/display/solr/JSON+Request+API
 */
export default (request, opts) => {

    let options = {
        method: 'GET',
        uri: opts.coreUrl + 'admin/ping',
        qs: {
            wt: 'json'
        },
        json: true
    };

    return request.get(options);
};