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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.solrClient = void 0;
const http_1 = __importDefault(require("http"));
const solrClient = (options) => {
    // const { schema } = url.UrlWithStringQuery(options.host);
    // const transport = schema === 'http' ? http : https;
    const transport = http_1.default;
    const opts = Object.assign({ timeout: 1000 }, options);
    const _get = (url) => __awaiter(void 0, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const request = transport.get(url, { timeout: opts.timeout }, (res) => {
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
        });
    });
    // https://nodejs.org/api/http.html#httprequesturl-options-callback
    const _post = (url, data) => __awaiter(void 0, void 0, void 0, function* () {
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
    });
    return {
        get: (resource, params = {}) => __awaiter(void 0, void 0, void 0, function* () {
            let url = `${options.host}${resource}`;
            if (Object.keys(params).length > 0)
                url += `?${new URLSearchParams(params)}`;
            // debug(url)
            return yield _get(url);
        }),
        post: (resource, data = {}, params = {}) => __awaiter(void 0, void 0, void 0, function* () {
            let url = `${options.host}${resource}`;
            if (Object.keys(params).length > 0)
                url += `?${new URLSearchParams(params)}`;
            const body = JSON.stringify(data);
            // console.log(url, body, params)
            return yield _post(url, body);
        })
    };
};
exports.solrClient = solrClient;
//# sourceMappingURL=client.js.map