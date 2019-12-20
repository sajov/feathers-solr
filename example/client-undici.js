const { Client } = require('undici');
const qs = require('qs');
const debug = require('debug')('feathers-solr-client');

class HttpClient {
  constructor (conn) {
    if (!conn) {
      throw new Error(
        'Connection string must be defined! http://localhost:8983/solr/core/'
      );
    }

    this.conn = conn;
    this.client = new Client('http://localhost:8983', {
      connections: 100,
      pipelining: 10
    });
  }

  get (api, params = {}) {
    const self = this;
    return new Promise(function (resolve, reject) {
      self.client.request(
        {
          headers: {
            'content-type': 'application/json'
          },
          path: `/solr/techproducts/${api}?${qs.stringify(
            params,
            { encode: false }
          )}`,
          method: 'GET'
        },
        function (err, data) {
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
        }
      );
    });
  }

  post (api, data, params = {}) {
    const self = this;

    return new Promise(function (resolve, reject) {
      self.client.request(
        {
          headers: {
            'content-type': 'application/json'
          },
          path: `/solr/techproducts/${api}?${qs.stringify(
            params,
            {wt:'json'},
            { encode: false }
          )}`,
          method: 'POST',
          body: Buffer.from(JSON.stringify(data))
        },
        function (err, data) {
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
        }
      );
    });
  }
}

module.exports = HttpClient;
