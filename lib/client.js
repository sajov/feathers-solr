const fetch = require('node-fetch');
const qs = require('qs');
const debug = require('debug')('feathers-solr-client');
const debugError = require('debug')('feathers-solr-client-error');
const { FeathersError } = require('@feathersjs/errors');

class Client {
  constructor(conn) {
    if (!conn) {
      throw new Error('Connection string must be defined! http://localhost:8983/solr/core/');
    }
    this.conn = conn;
    this.params = { wt: 'json' };
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

  get(api, params = {}) {
    const url = `${this.conn}/${api}?${qs.stringify(Object.assign({}, params, this.params), { encode: false })}`;
    const options = {
      method: 'get',
      headers: { 'Content-Type': 'application/json' }
    };
    debug('GET', url);

    return fetch(url, options).then(res => this._response(res));
  }

  post(api, data, params = {}) {
    const url = `${this.conn}/${api}?${qs.stringify(Object.assign({}, params, this.params))}`;
    const options = {
      method: 'post',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    };
    debug('Post:', url, '\n', data);

    return fetch(url, options).then(res => this._response(res));
  }
}

module.exports = Client;
