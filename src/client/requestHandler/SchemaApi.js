/**
 * Schema API
 * https://cwiki.apache.org/confluence/display/solr/Managed+Resources
 * https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API
 */

export default class Schema {

    constructor(request, opts) {
        console.log(opts);
        this.options = {
            method: 'POST',
            uri: opts.coreUrl + '/schema',
            json: true
        };
        console.log(this.options);

    //       let options = {
    //     method: 'POST',
    //     uri: opts.coreUrl + '/query',

    //     body:  Object.assign({
    //         query: '*:*',
    //     }, query),
    //     json: true
    // };
    // console.log('JSON API OPTIONS',options);
    // console.log('JSON API query',query.filter);
    // return request.get(options);

        this.request = request;
    }

    /* /schema/fields: retrieve information about all defined fields or a specific named field */
    fields() {
        this.options.uri += '/fields';
        this.options.method = 'GET';
        return  this.request(this.options);
    }
    /* /schema/dynamicfields: retrieve information about all dynamic field rules or a specific named dynamic rule */
    dynamicfields() {
        this.options.uri += '/dynamicfields';
        return  this.request(this.options);
    }
    /* /schema/fieldtypes: retrieve information about all field types or a specific field type */
    fieldtypes() {
        this.options.uri += '/fieldtypes';
        return  this.request(this.options);
    }
    /* /schema/copyfields: retrieve information about copy fields */
    copyfields() {
        this.options.uri += '/copyfields';
        return  this.request(this.options);
    }
    /* /schema/name: retrieve the schema name */
    name() {
        this.options.uri += '/name';
        return  this.request(this.options);
    }
    /* /schema/version: retrieve the schema version */
    version() {
        this.options.uri += '/version';
        return  this.request(this.options);
    }
    /* /schema/uniquekey: retrieve the defined uniqueKey */
    uniquekey() {
        this.options.uri += '/uniquekey';
        return  this.request(this.options);
    }
    /* /schema/similarity: retrieve the global similarity definition */
    similarity() {
        this.options.uri += '/similarity';
        return  this.request(this.options);
    }
    /* /schema/solrqueryparser/defaultoperator: retrieve the default operator */
    solrqueryparser() {
        this.options.uri += '/solrqueryparser/defaultoperator';
        return  this.request(this.options);
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
        this.options.body = {'add-field' : params};
        return this.request(this.options);
    }
    /* delete-field: delete a field. */
    deleteField(params) {
        this.options.qs = {
            'delete-field' : params
        };
        return this.request(this.options);
    }
    /* replace-field: replace an existing field with one that is differently configured. */
    replaceField(params) {
        this.options.qs = {
            'replace-field' : params
        };
        return this.request(this.options);
    }
    /* add-dynamic-field: add a new dynamic field rule with parameters you provide. */
    addFynamicField(params) {
        this.options.qs = {
            'add-dynamic-field' : params
        };
        return this.request(this.options);
    }
    /* delete-dynamic-field: delete a dynamic field rule. */
    deleteFynamicField(params) {
        this.options.qs = {
            'delete-dynamic-field' : params
        };
        return this.request(this.options);
    }
    /* replace-dynamic-field: replace an existing dynamic field rule with one that is differently configured. */
    replaceFynamicField(params) {
        this.options.qs = {
            'replace-dynamic-field' : params
        };
        return this.request(this.options);
    }
    /* add-field-type: add a new field type with parameters you provide. */
    addFieldType(params) {
        this.options.qs = {
            'add-field-type' : params
        };
        return this.request(this.options);
    }
    /* delete-field-type: delete a field type. */
    deleteFieldType(params) {
        this.options.qs = {
            'delete-field-type' : params
        };
        return this.request(this.options);
    }
    /* replace-field-type: replace an existing field type with one that is differently configured. */
    replaceFieldType(params) {
        this.options.qs = {
            'replace-field-type' : params
        };
        return this.request(this.options);
    }
    /* add-copy-field: add a new copy field rule. */
    addFopyField(params) {
        this.options.qs = {
            'add-copy-field' : params
        };
        return this.request(this.options);
    }
    /* delete-copy-field: delete a copy field rule. */
    deleteFopyField(params) {
        this.options.qs = {
            'delete-copy-field' : params
        };
        return this.request(this.options);
    }
}