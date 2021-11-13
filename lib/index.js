"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.escapeFn = void 0;
const errors_1 = require("@feathersjs/errors");
const commons_1 = require("@feathersjs/commons");
const adapter_commons_1 = require("@feathersjs/adapter-commons");
const client_1 = require("./client");
const response_1 = require("./response");
const query_1 = require("./query");
const escapeFn = (key, value) => {
    return { key, value };
};
exports.escapeFn = escapeFn;
class Service extends adapter_commons_1.AdapterService {
    constructor(options = {}) {
        super(commons_1._.extend({
            id: 'id',
            commit: {
                softCommit: true,
                commitWithin: 10000,
                overwrite: true
            },
            suggestHandler: 'suggest',
            defaultSearch: {},
            defaultParams: {
                echoParams: 'none'
                // debug:"all"
            },
            createUUID: true,
            escapeFn: exports.escapeFn
        }, options));
        const { host, core } = options;
        this.queryHandler = `/${core}/query`;
        this.updateHandler = `/${core}/update/json`;
        //@ts-ignore  SolrClientOptions ??
        this.client = (0, client_1.solrClient)({ host, core });
    }
    async _find(params = {}) {
        const { query, filters, paginate } = this.filterQuery(params);
        if (filters.$sort !== undefined) {
        }
        if (filters.$skip !== undefined) {
        }
        if (filters.$limit !== undefined) {
        }
        try {
            const solrQuery = (0, query_1.jsonQuery)(null, filters, query, paginate, this.options.escapeFn);
            console.log(solrQuery, 'solrQuerysolrQuerysolrQuerysolrQuerysolrQuery');
            const response = await this.client.post(this.queryHandler, solrQuery);
            // const result = {
            //   total,
            //   limit: filters.$limit,
            //   skip: filters.$skip || 0,
            //   data: []
            // };
            const result = (0, response_1.responseFind)(query, filters, paginate, response);
            // if (!(paginate && (paginate ).default)) {
            //   //@ts-ignore
            //   return result.data;
            // }
            return result;
        }
        catch (error) {
            console.log(error);
        }
    }
    //@ts-ignore
    async _get(id, params = {}) {
        //@ts-ignore
        const { query } = this.filterQuery(params);
        try {
            const result = { email: 'john@gmail.com', id: 'LYjqYywedn7C5gnB' };
            return result;
        }
        catch (error) {
            throw new errors_1.NotFound(`No record found for id '${id}'`);
        }
    }
    //@ts-ignore
    async _create(data, params = {}) {
        let dataToCreate = Array.isArray(data) ? data : [data];
        if (this.options.createUUID) {
            dataToCreate = (0, query_1.addIds)(dataToCreate, this.options.id);
        }
        const result = await this.client.post(this.updateHandler, dataToCreate, this.options.commit);
        return result;
    }
    //@ts-ignore
    async _update(id, data, params = {}) {
        return data;
    }
    //@ts-ignore
    async _patch(id, data, params = {}) {
        return data; // Will throw an error if not found
    }
    //@ts-ignore
    async _remove(id, params = {}) {
        //@ts-ignore
        return {};
    }
}
exports.Service = Service;
function service(options = {}) {
    return new Service(options);
}
exports.default = service;
//# sourceMappingURL=index.js.map