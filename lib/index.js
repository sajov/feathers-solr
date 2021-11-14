"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    _find(params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield this.client.post(this.queryHandler, solrQuery);
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
        });
    }
    //@ts-ignore
    _get(id, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            const { query } = this.filterQuery(params);
            try {
                const result = { email: 'john@gmail.com', id: 'LYjqYywedn7C5gnB' };
                return result;
            }
            catch (error) {
                throw new errors_1.NotFound(`No record found for id '${id}'`);
            }
        });
    }
    //@ts-ignore
    _create(data, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataToCreate = Array.isArray(data) ? data : [data];
            if (this.options.createUUID) {
                dataToCreate = (0, query_1.addIds)(dataToCreate, this.options.id);
            }
            const result = yield this.client.post(this.updateHandler, dataToCreate, this.options.commit);
            return result;
        });
    }
    //@ts-ignore
    _update(id, data, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return data;
        });
    }
    //@ts-ignore
    _patch(id, data, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return data; // Will throw an error if not found
        });
    }
    //@ts-ignore
    _remove(id, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            //@ts-ignore
            return {};
        });
    }
}
exports.Service = Service;
function service(options = {}) {
    return new Service(options);
}
exports.default = service;
//# sourceMappingURL=index.js.map