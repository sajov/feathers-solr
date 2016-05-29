/**
 * CoreAdmin API
 * https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API
 */

class CoreAdmin {

    constructor(request, opts) {

        this.options = {
            method: 'GET',
            uri: opts.url + '/admin/cores', // '/update/json' || /update/json/docs
            json: true
        };

        this.request = request;
    }

    /* STATUS */
    status(params) {

        this.options.qs = Object.assing({
            action: 'STATUS',
        }, params);

        return this.request(this.options);

    }

    /* CREATE */
    create(params) {

        this.options.qs = Object.assing({
            action: 'CREATE',
        }, params);

        return this.request(this.options);

    }

    /* RELOAD */
    reload(params) {

        this.options.qs = Object.assing({
            action: 'RELOAD',
        }, params);

        return this.request(this.options);

    }

    /* RENAME */
    rename(core, other) {

        this.options.qs = {
            action: 'RENAME',
            core: core,
            other: other
        };

        return this.request(this.options);

    }

    /* SWAP */
    swap(core, other) {

        this.options.qs = {
            action: 'SWAP',
            core: core,
            other: other
            // async:
        };

        return this.request(this.options);

    }

    /* UNLOAD */
    unload(params) {

        this.options.qs = Object.assing({
            action: 'UNLOAD',
        }, params);

        return this.request(this.options);

    }

    /* MERGEINDEXES */
    mergeindexes(params) {

        this.options.qs = Object.assing({
            action: 'MERGEINDEXES',
        }, params);

        return this.request(this.options);

    }

    /* SPLIT */
    split(params) {

        this.options.qs = Object.assing({
            action: 'SPLIT',
        }, params);

        return this.request(this.options);

    }

    /* REQUESTSTATUS */
    requeststatus(params) {

        this.options.qs = Object.assing({
            action: 'REQUESTSTATUS',
        }, params);

        return this.request(this.options);

    }
}