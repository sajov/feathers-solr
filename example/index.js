//@ts-ignore
const Service = require('../lib').Service;
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');

// Create an Express compatible Feathers application instance.
const app = express(feathers());
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// Set up default error handler
app.use(express.errorHandler());

// Create a service
const options = {
  host: 'http://localhost:8983/solr',
  core: 'techproducts',
  paginate: {},
  events: ['testing']
};
app.use('techproducts', new Service(options));

// Start the server.
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`)
});
