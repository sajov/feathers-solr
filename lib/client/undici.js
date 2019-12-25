const { Client } = require('undici');
const qs = require('qs');
const debug = require('debug')('feathers-solr-client-undici');
const debugError = require('debug')('feathers-solr-client-undici');
const { FeathersError } = require('@feathersjs/errors');

class HttpClient {
  constructor(conn, options = {}) {
    if (!conn && typeof conn != 'string') {
      throw new Error('Connection string must be defined! http://localhost:8983/solr/core/');
    }

    this.options = Object.assign(
      {
        connections: 100,
        pipelining: 10
      },
      options
    );

    this.client = new Client(conn, this.options);
  }

  get(api, params = {}) {
    const { url, options } = this._options(api, null, params);
    debug('GET', url);
    return this._request(options);
  }

  post(api, data, params = {}) {
    const { url, options } = this._options(api, data, params);
    debug('POST:', url, data);
    return this._request(options);
  }

  _options(api, data, params) {
    const url = `${this.client.url.pathname}/${api}?${qs.stringify(params, { encode: false })}`;
    const options = {
      headers: {
        'content-type': 'application/json'
      },
      path: url,
      method: data ? 'POST' : 'GET'
    };
    if (data) options.body = Buffer.from(JSON.stringify(data));

    return { url, options };
  }

  _request(options) {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.client.request(options, function(err, data) {
        if (err) reject(err);
        try {
          const { statusCode, headers, body } = data;
          if (statusCode >= 200 && statusCode < 300) {
            debug('Response:', statusCode);
            body.on('data', d => {
              return resolve(JSON.parse(d.toString()));
            });
          } else {
            reject(statusCode);
          }
        } catch (error) {
          reject(statusCode, error);
        }
      });
    });

    const { statusCode, headers, body } = data;
    try {
      if (statusCode >= 200 && statusCode < 300) {
        debug('Response:', statusCode);
        return body.on('data', d => {
          return JSON.parse(d.toString());
        });
      } else {
        throw new FeathersError(statusCode);
      }
    } catch (err) {
      debugError('Error:', err);
      throw new FeathersError(statusCode);
    }
  }
}

module.exports = HttpClient;
