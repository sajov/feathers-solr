/**
 * @class Schema API
 * @typicalname instance
 * https://cwiki.apache.org/confluence/display/solr/Managed+Resources
 * https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API
 */
export default class Schema {

    /**
     * @method Constructor
     * @param  {object} request Request
     * @param  {object} opts    Default Request params
     * @return {object}         Promise
     */
    constructor(request, opts) {
        this.options = {
            method: 'POST',
            uri: opts.coreUrl + '/schema',
            json: true
        };

        this.request = request;
    }

    /**
     * @method Req request method
     * @param  {object} opts Options
     * @return {object}      Returns a Promise
     */
    req(opts) {
        return this.request(Object.assign({}, this.options, opts));
    }

        /**
     * @method Name
     * @param  {object} opts Options
     * @return {object}      Returns a Promise
     */
    name() {
            return this.req({ uri: (this.options.uri + '/name'), method: 'GET' });
        }
        /* /schema/version: retrieve the schema version */
    version() {
            return this.req({ uri: (this.options.uri + '/version'), method: 'GET' });
        }
        /* /schema/uniquekey: retrieve the defined uniqueKey */
    uniquekey() {
            return this.req({ uri: (this.options.uri + '/uniquekey'), method: 'GET' });
        }
        /* /schema/similarity: retrieve the global similarity definition */
    similarity() {
            return this.req({ uri: (this.options.uri + '/similarity'), method: 'GET' });
        }
        /* /schema/fields: retrieve information about all defined fields or a specific named field */
    fields() {
            return this.req({ uri: (this.options.uri + '/fields'), method: 'GET' });
        }
        /* /schema/dynamicfields: retrieve information about all dynamic field rules or a specific named dynamic rule */
    dynamicfields() {
            return this.req({ uri: (this.options.uri + '/dynamicfields'), method: 'GET' });
        }
        /* /schema/fieldtypes: retrieve information about all field types or a specific field type */
    fieldtypes() {
            return this.req({ uri: (this.options.uri + '/fieldtypes'), method: 'GET' });
        }
        /* /schema/copyfields: retrieve information about copy fields */
    copyfields() {
        return this.req({ uri: (this.options.uri + '/copyfields'), method: 'GET' });
    }

    /* /schema/solrqueryparser/defaultoperator: retrieve the default operator */
    solrqueryparser() {
        return this.req({ uri: (this.options.uri + '/solrqueryparser/defaultoperator'), method: 'GET' });
    }

    /* add-field: add a new field with parameters you provide.
        curl -X POST -H 'Content-type:application/json' --data-binary '{
          "add-field":[
             { "name":"shelf",
               "type":"myNewTxtField",
               "stored":true },
             { "name":"location",
               "type":"myNewTxtField",
               "stored":true }]
        }' http://localhost:8983/solr/gettingstarted/schema
    */
    addField(params) {
            this.options.body = { 'add-field': params };
            // console.log('add-field', this.options.body);
            return this.request(this.options);
        }
        /* delete-field: delete a field. */
    deleteField(params) {
            this.options.body = {
                'delete-field': params
            };
            // this.options.qs = {
            //     'delete-field' : params
            // };
            // console.log('deleteField', this.options.body);
            return this.request(this.options);
        }
        /* replace-field: replace an existing field with one that is differently configured. */
    replaceField(params) {
            this.options.qs = {
                'replace-field': params
            };
            return this.request(this.options);
        }
        /* add-dynamic-field: add a new dynamic field rule with parameters you provide. */
    addDynamicField(params) {
            this.options.qs = {
                'add-dynamic-field': params
            };
            return this.request(this.options);
        }
        /* delete-dynamic-field: delete a dynamic field rule. */
    deleteFynamicField(params) {
            this.options.qs = {
                'delete-dynamic-field': params
            };
            return this.request(this.options);
        }
        /* replace-dynamic-field: replace an existing dynamic field rule with one that is differently configured. */
    replaceFynamicField(params) {
            this.options.qs = {
                'replace-dynamic-field': params
            };
            return this.request(this.options);
        }
        /* add-field-type: add a new field type with parameters you provide. */
    addFieldType(params) {
            this.options.qs = {
                'add-field-type': params
            };
            return this.request(this.options);
        }
        /* delete-field-type: delete a field type. */
    deleteFieldType(params) {
            this.options.qs = {
                'delete-field-type': params
            };
            return this.request(this.options);
        }
        /* replace-field-type: replace an existing field type with one that is differently configured. */
    replaceFieldType(params) {
            this.options.qs = {
                'replace-field-type': params
            };
            return this.request(this.options);
        }
        /* add-copy-field: add a new copy field rule. */
    addCopyField(params) {
            this.options.qs = {
                'add-copy-field': params
            };
            return this.request(this.options);
        }
        /* delete-copy-field: delete a copy field rule. */
    deleteCopyField(params) {
        this.options.qs = {
            'delete-copy-field': params
        };
        return this.request(this.options);
    }
}
