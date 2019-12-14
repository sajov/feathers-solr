const feathers = require("@feathersjs/feathers");
const Service = require("../lib");
const Client = require("../lib").Client;

const options = {
  Model: new Client("http://localhost:8983/solr/techproducts"),
  name: "techproducts",
  paginate: {},
  multi: true,
  events: ["testing"]
};
const app = feathers();
const solr = new Service(options);
app.use("solr", solr);
// solr.on("testing", res => console.log("on.testing", res));
app.service("solr").emit("testing", {
  type: "customEvent",
  data: "can be anything"
});

const params = {
  query: {
    $or: [
      { name: "Doug" },
      {
        age: {
          $gte: 18,
          $lt: 25
        }
      }
    ],
    $sort: { name: 1 }
  }
};
const service = app.service("solr");
// const create = service
//   .create({
//     id: "test",
//     name: "Dave",
//     age: 29,
//     created: true
//   })
//   .then(res => console.log(res));
// const get = service
//   .get("test", {
//     query: { name: "Dave", age: 29, created: true }
//   })
//   .then(res => {
//     console.log(res);
//     console.log(create);
//   });
service
  .remove(null, { query: { id: "*" } })
  .then(res => {
    console.log("remove", res);
    console.log("events:", app.service("solr").events);
    console.log("events:", app.service("solr").Model);
    // service.create({ name: "Dave", age: 29, created: true });
    // service.create({
    //   name: "David",
    //   age: 3,
    //   created: true
    // });
  })
  .catch(err => console.log(err));
// solr
//   .create({
//     id: "demo",
//     name: "Dougler",
//     age: 10
//   })
//   .then(res => {
//     console.log("create.res", res);
//     solr
//       .patch("demo", {
//         name: "PatchDoug"
//       })
//       .then(res => {
//         console.log("patch.res", res);
//       })
//       .catch(err => {
//         console.log("patch.err", err);
//       });
//   })
//   .catch(err => {
//     console.log("create.err", err);
//   });
// solr
//   .get("1")
//   .then(res => console.log("get", res))
//   .catch(err => console.log(err));

// solr
//   .find(params)
//   .then(res => {
//     console.log("RES", res);
//   })
//   .catch(err => {
//     console.log("ERR", err);
//   });
// solr
//   .create({
//     name: "Sajo",
//     age: 49,
//     id: "afd6e1d0-1a07-11ea-ba7b-efce98bcbcd7"
//   })
//   .then(res => {
//     console.log("RES", res);
//   })
//   .catch(err => {
//     console.log("ERR", err);
//   });
// console.log(solr.Model);
// solr.options.Model.post("schema/fields", {
//   "add-field": {
//     name: "name",
//     type: "text_general",
//     multiValued: false,
//     indexed: true,
//     stored: true
//   },
//   "add-field": {
//     name: "age",
//     type: "pint",
//     multiValued: false,
//     indexed: true,
//     stored: true
//   }
// })
//   .then(res => {
//     console.log("RES", res);
//     solr.remove("*").then(res => console.log("RES", res)).catch(err => console.log(err));
//   })
//   .catch(err => {
//     console.log("ERR", err);
//   });

// solr
//   .get("afd6e1d0-1a07-11ea-ba7b-efce98bcbcd7")
//   .then(res => {
//     console.log("Solr.get.res ???", res);
//   })
//   .catch(err => {
//     console.log("Solr.get.err ???", err);
//   });

// solr
//   .remove("*")
//   .then(res => {
//     solr
//       .create({
//         name: "Sajo",
//         age: 49,
//         id: "afd6e1d0-1a07-11ea-ba7b-efce98bcbcd7"
//       })
//       .then(res => {
//         // console.log("Solr.create.res", res);
//         solr
//           .get("afd6e1d0-1a07-11ea-ba7b-efce98bcbcd7")
//           .then(res => {
//             console.log("Solr.get.res", res);
//             solr.remove("*").catch(err => console.log(err));
//           })
//           .catch(err => {
//             // console.log("Solr.get.err", err);
//           });
//         solr
//           .find({ query: { $limit: 0 }, pagination: { default: 2 } })
//           .then(res => {
//             console.log("Solr.find.res", res);
//             solr.remove("*").catch(err => console.log(err));
//           })
//           .catch(err => {
//             // console.log("Solr.get.err", err);
//           });
//       })
//       .catch(err => {
//         // console.log("Solr.create.err", err);
//       });
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
