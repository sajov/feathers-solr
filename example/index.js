const fetch = require("node-fetch");
const Service = require("../lib");
const Client = require("../lib").Client;

const options = {
  Model: new Client("http://localhost:8983/solr/techproducts/query"),
  name: "techproducts",
  paginate: {}
};

const solr = new Service(options);

solr
  .find({})
  .then(res => {
    console.log(res);
  })
  .catch(err => console.log(err));
