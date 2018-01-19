/**
 * Solr Config API
 * https://cwiki.apache.org/confluence/display/solr/Config+API#ConfigAPI-CreatingandUpdatingRequestHandlers
 * https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig
 *
 *
 *   Client.config({
 *       'add-searchcomponent': {
 *           'name': 'suggest',
 *           'class': 'solr.SuggestComponent',
 *           'suggester': {
 *               'name': 'suggest',
 *               'lookupImpl': 'FuzzyLookupFactory',
 *               'dictionaryImpl': 'DocumentDictionaryFactory',
 *               'field': 'name',
 *               'suggestAnalyzerFieldType': 'string',
 *               'buildOnStartup': 'true'
 *           }
 *       }
 *   })
 */

export default (request, opts, params) => {

    let options = {
        method: params ? 'POST' : 'GET',
        uri: opts.coreUrl + '/config',
        json: true,
        body: params
    };

    return request(options);
};


/**
 * Solr Config API
 * https://cwiki.apache.org/confluence/display/solr/Config+API#ConfigAPI-CreatingandUpdatingRequestHandlers
 * https://cwiki.apache.org/confluence/display/solr/RequestHandlers+and+SearchComponents+in+SolrConfig
 */

// export default class ConfigApi {

//     constructor(request, opts) {
//         this.options = {
//             method: 'POST',
//             uri: opts.coreUrl + '/config',
//             json: true
//         };


//         this.request = request;
//     }

//     /**
//      * set-property
//      * Commands for Common Properties
//      * @param {[type]} params [description]
//      */
//     setProperty(params) {
//         this.options.body = params;
//         return this.request(this.options);
//     }

//     /**
//      * unset-property
//      * Commands for Common Properties
//      * @param {[type]} params [description]
//      */
//     unsetProperty(params) {
//         this.options.body = {'unset-property' : params};
//         return this.request(this.options);
//     }

//     /**
//      * set-property
//      * Commands for Common Properties
//      * @param {[type]} params [description]
//      */
//     setProperty(params) {
//         this.options.body = {'set-property' : params};
//         return this.request(this.options);
//     }

//     /**
//      * unset-property
//      * Commands for Common Properties
//      * @param {[type]} params [description]
//      */
//     unsetProperty(params) {
//         this.options.body = {'unset-property' : params};
//         return this.request(this.options);
//     }
// }

// export var another = {};
