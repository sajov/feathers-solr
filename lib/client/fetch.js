const qs = require('qs');
const debug = require('debug')('feathers-solr-client');
const debugError = require('debug')('feathers-solr-client-error');
const { FeathersError } = require('@feathersjs/errors');

class FetchClient {
  constructor (fetch, conn) {
    if (!conn) {
      throw new Error('Connection string must be defined! http://localhost:8983/solr/core/');
    }
    this.fetch = fetch;
    this.conn = conn;
  }

  get (api, params = {}) {
    const { url, options } = this._options(api, null, params);
    debug('GET', url);
    return this.fetch(url, options).then(res => this._response(res));
  }

  post (api, data, params = {}) {
    const { url, options } = this._options(api, data, params);
    debug('POST:', url, data);
    return this.fetch(url, options).then(res => this._response(res));
  }

  _options (api, data, params) {
    const url = `${this.conn}/${api}?${qs.stringify(params, { encode: false })}`;
    const options = {
      method: data ? 'post' : 'get',
      headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.body = JSON.stringify(data);

    return { url, options };
  }

  _response (res) {
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
}

module.exports = FetchClient;
