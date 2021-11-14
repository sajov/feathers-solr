"use strict";
// import { _ } from '@feathersjs/commons';
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
exports.responseGet = exports.responseFind = void 0;
/**
 * Response parser
 */
// @ts-ignore
function responseFind(filters, query, paginate, res) {
    const { responseHeader, response } = res;
    const { numFound, start, docs, grouped } = response, additionalResponse = __rest(response, ["numFound", "start", "docs", "grouped"]);
    const { max, default: def } = paginate;
    const { $limit, $skip } = filters;
    if (!max && !def) {
        return docs || grouped;
    }
    return Object.assign({ QTime: responseHeader.QTime || 0, total: numFound || 0, limit: $limit ? parseInt($limit) : paginate.default || paginate.max, skip: $skip ? parseInt($skip) : 0, data: docs || grouped }, additionalResponse);
}
exports.responseFind = responseFind;
/**
 * Response Docs parser
 */
// @ts-ignore
function responseGet(res, allDocs = false) {
    const { response } = res;
    //@ts-ignore
    // if (!_.has(res, 'response.docs') && !_.has(res, 'grouped')) {
    //   return allDocs === false ? {} : [];
    // }
    // const docs = _.get(res, 'response.docs') || _.get(res, 'grouped') || [];
    return allDocs === false ? response.docs[0] : response.docs;
}
exports.responseGet = responseGet;
//# sourceMappingURL=response.js.map