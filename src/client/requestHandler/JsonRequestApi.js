/**
 * Solr Config API
 * https://cwiki.apache.org/confluence/display/solr/JSON+Request+API
 *
 *
 *
 *
    curl http://localhost:8983/solr/gettingstarted/query -d '
    {
      "query" : "*:*",
      "filter" : "id:222"
    }'
 */
export default (request, opts, query) => {

    let options = {
        method: 'POST',
        uri: opts.coreUrl + '/query',
        // body: {
        //     query: '*:*',
        //     filter : 'id:222'

        // },
        body:  Object.assign({
            query: '*:*',
        }, query),
        json: true
    };

    return request.get(options);
};
