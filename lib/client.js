const fetch = require("node-fetch");
const qs = require("qs");

class Client {
  constructor(conn) {
    if (!conn) {
      throw new Error(
        "Connection string must be defined! http://localhost:8983/solr/core/"
      );
    }

    this.conn = conn;

    this.params = {
      params: {
        wt: "json"
      }
    };
  }

  get(api, params) {
    const params = Object.assign(params, this.params);
    const url = `${this.conn}/${api}?${qs.stringify(params)}`;

    return fetch(url).then(res => res.json());
  }

  post(api, params, data) {
    const options = {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    };
    const url = `${this.conn}/${api}`;

    return fetch(url, options).then(res => res.json());
  }
}
module.exports = Client;
