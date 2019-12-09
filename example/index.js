const feathers = require("@feathersjs/feathers");
const Service = require("../lib");
const Client = require("../lib").Client;

const options = {
  Model: new Client("http://localhost:8983/solr/techproducts"),
  name: "techproducts",
  paginate: {},
  multi: true
};

const solr = new Service(options);
console.log(solr.Model);
solr.options.Model.post("schema/fields", {
  "add-field": {
    name: "namewwwwss",
    type: "text_general",
    multiValued: false,
    indexed: true,
    stored: true
  }
})
  .then(res => {
    console.log("RES", res);
  })
  .catch(err => {
    console.log("ERR", err);
  });

// solr
//   .create({ name: "Doug", age: 32, id: "afd6e1d0-1a07-11ea-ba7b-efce98bcbcd7" })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => console.log(err));
// solr
//   .find({})
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => console.log(err));
// solr
//   // .remove("d06d9841-19c0-11ea-b751-998a19dabeef")
//   // .remove(null, { action_s: "*" })
//   .remove(null, { name: "cart" })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => console.log(err));
