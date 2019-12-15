const { Client } = require("undici");
const qs = require("qs");
const debug = require("debug")("feathers-solr-client");

class HttpClient {
  constructor(conn) {
    if (!conn) {
      throw new Error(
        "Connection string must be defined! http://localhost:8983/solr/core/"
      );
    }

    this.conn = conn;
    this.params = { wt: "json" };
    this.client = new Client(`http://localhost:8983`, {
      connections: 100,
      pipelining: 10
    });
  }

  get(api, params = {}) {
    const url = `${this.conn}/${api}?${qs.stringify(
      Object.assign({}, params, this.params),
      { encode: false }
    )}`;
    const self = this;
    return new Promise(function(resolve, reject) {
      self.client.request(
        {
          headers: {
            "content-type": "application/json"
          },
          path: `/solr/techproducts/${api}?${qs.stringify(
            Object.assign({}, params, this.params),
            { encode: false }
          )}`,
          method: "GET"
        },
        function(err, data) {
          if (err) reject(err);
          const { statusCode, headers, body } = data;
          body.on("data", d => {
            resolve(JSON.parse(d.toString()));
          });
        }
      );
    });
  }

  async post(api, data, params = {}) {
    const self = this;
    return new Promise(function(resolve, reject) {
      self.client.request(
        {
          headers: {
            "content-type": "application/json"
          },
          path: `/solr/techproducts/${api}`,
          method: "POST",
          body: Buffer.from(JSON.stringify(data))
        },
        function(err, data) {
          if (err) reject(err);
          const { statusCode, headers, body } = data;
          body.on("data", d => {
            resolve(JSON.parse(d.toString()));
          });
        }
      );
    });
  }
}

module.exports = HttpClient;
