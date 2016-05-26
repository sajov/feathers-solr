/**
 * @param  {object}
 * @param  {object}
 * @return {object}
 */
export default (request, opts) => {

    // 'http://localhost:8983/solr/gettingstarted/admin/ping?wt=json'

    let options = {
        method: 'GET',
        uri: opts.coreUrl + 'admin/ping',
        qs: {
            wt: 'json'
        },
        json: true
    };

    return request(options);
};