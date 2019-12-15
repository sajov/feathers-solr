const req = require("req-fast");
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
      url: url,
      method: "get",
      "content-type": "application/json"
    };
    return new Promise(function(resolve, reject) {
      req(options, (err, response) => {
        // console.log("FAST REQUEST GET", err, response.body);
        if (err) reject(err);
        return resolve(response.body);
      });
    });
  }

  post(api, data, params = {}) {
    const url = `${this.conn}/${api}`;
    const options = {
      url: url,
      method: "post",
      data: data,
      "content-type": "application/json"
    };
    debug("POST", url, "\n", data);

    return new Promise(function(resolve, reject) {
      req(options, (err, response) => {
        // console.log("FAST REQUEST POST", err, response.body);
        if (err) reject(err);
        return resolve(JSON.parse(response.body));
      });
    });
  }
}

module.exports = Client;
