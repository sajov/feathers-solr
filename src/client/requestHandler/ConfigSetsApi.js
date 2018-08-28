/**
 * Solr ConfigSets API
 * https://lucene.apache.org/solr/guide/6_6/configsets-api.html
 */

export default class ConfigSets {

    constructor(request, opts) {

        this.options = {
            method: 'GET',
            uri: opts.url + '/admin/configs',
            json: true
        };

        this.request = request;
    }

    /* CREATE */
    create(params) {

        this.options.qs = Object.assign({
            action: 'CREATE',
            name:'myConfigSet',
            baseConfigSet:'_default',
            configSetProp:{immutable:false},
        }, params);

        return this.request(this.options);

    }

    /* DELETE */
    delete(params) {

        this.options.qs = Object.assign({
            action: 'DELETE',
        }, params);

        return this.request(this.options);

    }

    /* LIST */
    list(params) {

        this.options.qs = Object.assign({
            action: 'LIST',
        }, params);

        return this.request(this.options);

    }
}