const fetch = require("node-fetch");
const qs = require("qs");
const debug = require("debug")("feathers-solr-client");

class Client {
  constructor(conn) {
    if (!conn) {
      throw new Error(
        "Connection string must be defined! http://localhost:8983/solr/core/"
      );
    }

    this.conn = conn;
    this.params = { wt: "json" };
  }

  get(api, params = {}) {
    const url = `${this.conn}/${api}?${qs.stringify(
      Object.assign({}, params, this.params),
      { encode: false }
    )}`;
    debug("GET", url);
    const options = {
      method: "get",
      headers: { "Content-Type": "application/json" }
    };

    return fetch(url, options).then(res => res.json());
  }

  post(api, data, params = {}) {
    const url = `${this.conn}/${api}?${qs.stringify(
      Object.assign({}, params, this.params)
    )}`;

    const options = {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    };
    debug("POST", url, "\n", data);
    return fetch(url, options).then(res => {
      try {
        if (res.status >= 200 && res.status < 300) {
          return res.json();
        }
      } catch (err) {
        return err;
      }
    });
  }
}

module.exports = Client;
