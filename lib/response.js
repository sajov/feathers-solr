"use strict";
// import { _ } from '@feathersjs/commons';
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseGet = exports.responseFind = void 0;
/**
 * Response parser
 */
// @ts-ignore
function responseFind(filters, query, paginate, res) {
    const { responseHeader, response } = res;
    const { numFound, start, docs, grouped, ...additionalResponse } = response;
    const { max, default: def } = paginate;
    const { $limit, $skip } = filters;
    if (!max && !def) {
        return docs || grouped;
    }
    return {
        QTime: responseHeader.QTime || 0,
        total: numFound || 0,
        limit: $limit ? parseInt($limit) : paginate.default || paginate.max,
        skip: $skip ? parseInt($skip) : 0,
        data: docs || grouped,
        ...additionalResponse
    };
}
exports.responseFind = responseFind;
/**
 * Response Docs parser
 */
// @ts-ignore
function responseGet(res, allDocs = false) {
    //@ts-ignore
    // if (!_.has(res, 'response.docs') && !_.has(res, 'grouped')) {
    //   return allDocs === false ? {} : [];
    // }
    // const docs = _.get(res, 'response.docs') || _.get(res, 'grouped') || [];
    return allDocs === false ? res.docs[0] : res.docs;
}
exports.responseGet = responseGet;
//# sourceMappingURL=response.js.map