const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const Service = require("../lib");
const Client = require("../lib").Client;
const ClientFastReq = require("./client-fast-req");
const ClientUndici = require("./client-undici");
// Create an Express compatible Feathers application instance.
const app = express(feathers());
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// Enable REST services

// Set up Solr Services
const options = {
  Model: {},
  name: "techproducts",
  paginate: {},
  multi: true,
  events: ["testing"]
};

// Http Client Fetch
options.Model = new Client("http://localhost:8983/solr/techproducts");
const solr = new Service(options);
app.use("fetch", solr);

// Http Client Fast-Req
options.Model = new ClientFastReq("http://localhost:8983/solr/techproducts");
const solrFastReq = new Service(options);
app.use("fastreq", solrFastReq);

// Http Client Undici
options.Model = new ClientUndici("http://localhost:8983/solr/techproducts");
const solrUndici = new Service(options);
app.use("undici", solrUndici);

// Set up default error handler
// app.use(express.errorHandler());

// Start the server.
const port = 3030;

var server = app.listen(port, () => {
  console.log(`Feathers server listening on port http://127.0.0.1:${port}`);
});

process.on("SIGINT", function() {
  console.error("Caught SIGINT, shutting down.");
  server.close();
});
