const fetch = require("node-fetch");
const qs = require("qs");
const debug = require("debug")("feathers-solr");
class Client {
  constructor(conn) {
    if (!conn) {
      throw new Error(
        "Connection string must be defined! http://localhost:8983/solr/core/"
      );
    }

    this.conn = conn;
    this.params = {
      wt: "json"
    };
  }

  get(api, params = {}) {
    const url = `${this.conn}?${qs.stringify(
      Object.assign({}, params, this.params)
    )}`;

    console.log("Client.get", url);

    return fetch(url).then(res => res.json());
  }

  post(api, data, params = {}) {
    const options = {
      method: "post",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    };

    const url = `${this.conn}/${api}?${qs.stringify(
      Object.assign({}, params, this.params)
    )}`;

    // console.log("Client.post", url, options);

    return fetch(url, options).then(res => res.json());
  }
}
module.exports = Client;
