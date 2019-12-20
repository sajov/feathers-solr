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

  _response(res) {
    try {
      if (res.status >= 200 && res.status < 300) {
        debug('Response:', res.status);
        return res.json();
      } else {
        throw new FeathersError(res.status, res.statusText);
      }
    } catch (err) {
      debugError('Error:', err);
      throw new FeathersError(res.status, res.statusText);
    }
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
          const { statusCode, headers, body } = data;
          body.on('data', d => {
            resolve(JSON.parse(d.toString()));
          });
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
          const { statusCode, headers, body } = data;
          body.on('data', d => {
            return resolve(JSON.parse(d.toString()));
          });
        }
      );
    });
  }
}

module.exports = HttpClient;
