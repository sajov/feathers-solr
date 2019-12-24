const { Client } = require('undici');
const qs = require('qs');
const debug = require('debug')('feathers-solr-client-undici');

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
    const self = this;
    const { url, options } = this._options(api, null, params);
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
  }

  post(api, data, params = {}) {
    const self = this;
    const { url, options } = this._options(api, data, params);
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
}

module.exports = HttpClient;
