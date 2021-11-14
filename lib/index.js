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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
    _getOrFind(id, params = {}) {
        if (id === null) {
            return this._find(Object.assign(params, {
                paginate: false
            }));
        }
        return this._get(id, params);
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
            const { query, filters, paginate } = this.filterQuery(params);
            try {
                const solrQuery = (0, query_1.jsonQuery)(id, filters, query, paginate, this.options.escapeFn);
                const response = yield this.client.post(this.queryHandler, solrQuery);
                if (response.response.numFound === 0)
                    throw new errors_1.NotFound(`No record found for id '${id}'`);
                const result = (0, response_1.responseGet)(response, false);
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
            if (commons_1._.isEmpty(data))
                throw new errors_1.MethodNotAllowed('Data is empty');
            let dataToCreate = Array.isArray(data) ? data : [data];
            if (this.options.createUUID) {
                dataToCreate = (0, query_1.addIds)(dataToCreate, this.options.id);
            }
            yield this.client.post(this.updateHandler, dataToCreate, this.options.commit);
            return Array.isArray(data) ? dataToCreate : dataToCreate[0];
        });
    }
    //@ts-ignore
    _update(id, data, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const sel = (0, adapter_commons_1.select)(params, this.id);
            const referenceData = yield this._getOrFind(id, params);
            if (commons_1._.isEmpty(referenceData))
                throw new errors_1.NotFound('No record found');
            const dataToUpdate = id && !Array.isArray(data) ? [Object.assign({ id }, data)] : data;
            yield this.client.post(this.updateHandler, dataToUpdate, this.options.commit);
            return this._getOrFind(id, params).then(res => sel(commons_1._.omit(res, 'score', '_version_')));
        });
    }
    //@ts-ignore
    _patch(id, data, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const sel = (0, adapter_commons_1.select)(params, this.id);
            const dataToPatch = yield this._getOrFind(id, params);
            const { ids, patchData } = (0, query_1.patchQuery)(dataToPatch, data, this.id);
            yield this.client.post(this.updateHandler, patchData, this.options.commit);
            return this._find({ query: { id: { $in: ids } } }).then(res => sel(ids.length === 1 ? res[0] : res));
        });
    }
    //@ts-ignore
    _remove(id, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!id && commons_1._.isEmpty(params)) {
                throw new errors_1.MethodNotAllowed('Delete with out id and query is not allowed');
            }
            const _a = this.filterQuery(params), { paginate } = _a, query = __rest(_a, ["paginate"]);
            const sel = (0, adapter_commons_1.select)(params, this.id);
            const dataToDelete = yield this._getOrFind(id, params);
            const queryToDelete = (0, query_1.deleteQuery)(id, query, this.options.escapeFn);
            yield this.client.post(this.updateHandler, queryToDelete, this.options.commit);
            return sel(dataToDelete);
        });
    }
}
exports.Service = Service;
function service(options = {}) {
    return new Service(options);
}
exports.default = service;
//# sourceMappingURL=index.js.map