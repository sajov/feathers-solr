/**
 * Solr Managed Resources
 * https://lucene.apache.org/solr/guide/6_6/managed-resources.html
 */

export class ManagedResources {

    constructor(request, opts) {

        this.options = {
            method: 'GET',
            uri: opts.urlCore + '/schema/analysis',
            json: true
        };

        this.request = request;
    }

    /* ADD */
    add(params) {
        this.options.uri += '/stopwords/english';
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