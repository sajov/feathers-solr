/**
 * Request Parameters API
 * https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API
 */

exports class RequestParameters {

    constructor(request, opts) {

        this.options = {
            method: 'GET',
            uri: opts.urlCore + '/config/params',
            json: true
        };

        this.request = request;
    }

    /* SET */
    set(params) {
        return this.request(this.options);
    }

    /* UNSET */
    unset(params) {
        return this.request(this.options);
    }

    /* UPDATE */
    update(params) {
        return this.request(this.options);
    }
}