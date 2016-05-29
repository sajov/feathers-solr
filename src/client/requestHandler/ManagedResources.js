/**
 * Solr Managed Resources
 * https://cwiki.apache.org/confluence/display/solr/Managed+Resources
 */

export class ConfigSets {

    constructor(request, opts) {

        this.options = {
            method: 'GET',
            uri: opts.urlCore + '/schema/analysis/stopwords/english"',
            json: true
        };

        this.request = request;
    }

    /* CREATE */
    create(params) {

        this.options.qs = Object.assing({
            action: 'STATUS',
        }, params);

        return this.request(this.options);

    }

    /* DELETE */
    delete(params) {

        this.options.qs = Object.assing({
            action: 'STATUS',
        }, params);

        return this.request(this.options);

    }

    /* LIST */
    list(params) {

        this.options.qs = Object.assing({
            action: 'STATUS',
        }, params);

        return this.request(this.options);

    }
}