"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solrClient = void 0;
const http_1 = __importDefault(require("http"));
// import https from 'https';
// import url from 'url';
const querystring_1 = __importDefault(require("querystring"));
const commons_1 = require("@feathersjs/commons");
const debug = (0, commons_1.createDebug)('solr');
const solrClient = (options) => {
    // const { schema } = url.UrlWithStringQuery(options.host);
    // const transport = schema === 'http' ? http : https;
    const transport = http_1.default;
    const opts = {
        timeout: 1000,
        ...options
    };
    const _get = async (url) => {
        return new Promise((resolve, reject) => {
            const request = transport.get(url, { timeout: opts.timeout }, (res) => {
                if (res.statusCode < 200 || res.statusCode > 299) {
                    return reject(new Error(`HTTP status code ${res.statusCode}`));
                }
                let body = [];
                res.on('data', (chunk) => body.push(chunk));
                res.on('end', () => {
                    const resString = Buffer.concat(body).toString();
                    resolve(resString);
                });
            });
            request.on('error', (err) => {
                reject(err);
            });
            request.on('timeout', () => {
                request.destroy();
                reject(new Error('timed out'));
            });
        });
    };
    // https://nodejs.org/api/http.html#httprequesturl-options-callback
    const _post = async (url, data) => {
        return new Promise((resolve, reject) => {
            const request = transport.request(url, {
                method: 'post',
                timeout: opts.timeout,
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(data)
                }
            }, (res) => {
                if (res.statusCode < 200 || res.statusCode > 299) {
                    return reject(new Error(`HTTP status code ${res.statusCode}`));
                }
                let body = [];
                res.on('data', (chunk) => body.push(chunk));
                res.on('end', () => {
                    const response = Buffer.concat(body).toString('utf8');
                    resolve(JSON.parse(response));
                });
            });
            request.on('error', (err) => {
                reject(err);
            });
            request.on('timeout', () => {
                request.destroy();
                reject(new Error('timed out'));
            });
            request.write(data);
            request.end();
        });
    };
    return {
        get: async (resource, params = {}) => {
            let url = `${options.host}${resource}`;
            if (Object.keys(params).length > 0)
                url += `?${querystring_1.default.stringify(params)}`;
            debug(url);
            return await _get(url);
        },
        post: async (resource, data = {}, params = {}) => {
            let url = `${options.host}${resource}`;
            if (Object.keys(params).length > 0)
                url += `?${querystring_1.default.stringify(params)}`;
            const body = JSON.stringify(data);
            debug(url, body, params);
            return await _post(url, body);
        }
    };
};
exports.solrClient = solrClient;
//# sourceMappingURL=client.js.map