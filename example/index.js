const feathers = require("@feathersjs/feathers");
const express = require("@feathersjs/express");
const Service = require("../lib");
const Client = require("../lib").Client;
// Create an Express compatible Feathers application instance.
const app = express(feathers());
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// Enable REST services

// Set up Solr Service
const options = {
  Model: new Client("http://localhost:8983/solr/techproducts"),
  name: "techproducts",
  paginate: {},
  multi: true,
  events: ["testing"]
};
const solr = new Service(options);
app.use("solr", solr);

// Set up default error handler
app.use(express.errorHandler());

// Start the server.
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`);
});
