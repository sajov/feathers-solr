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
    // console.log("this.client", this.client);
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

  async post(api, data, params = {}) {
    // const z = `http://localhost:8983/solr/techproducts/${api}`;
    // console.log(z, data);
    // const { statusCode, headers, body } = await this.client.request({
    //   headers: {
    //     "content-type": "application/json"
    //   },
    //   path: `/solr/techproducts/${api}`,
    //   method: "POST",
    //   // body: data
    //   // body: JSON.stringify(data)
    //   body: Buffer.from(JSON.stringify(data))
    // });

    // console.log("response received", statusCode);
    // console.log("headers", headers);
    // body.on("data", d => {
    //   console.log(JSON.parse(d.toString()));
    //   return JSON.parse(d.toString());
    // });

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
          // console.log("response received", statusCode);
          // console.log("headers", headers);
          body.on("data", d => {
            resolve(JSON.parse(d.toString()));
          });

          // this.client.close();
        }
      );
    });
  }
}

module.exports = HttpClient;
