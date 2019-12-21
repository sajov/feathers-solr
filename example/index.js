const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const Service = require('../lib');
const { fetchClient, undiciClient } = require('../lib');
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
  paginate: {},
  multi: true,
  events: ['testing']
};

// Http Client Fetch
options.Model = new fetchClient('http://localhost:8983/solr/gettingstarted');
const solrFetch = new Service(options);
app.use('fetch', solrFetch);

// Http Client Undici
options.Model = new undiciClient('http://localhost:8983/solr/gettingstarted');
const solrUndici = new Service(options);
app.use('undici', solrUndici);

// Set up default error handler
// app.use(express.errorHandler());

// Start the server.
const port = 3030;

var server = app.listen(port, () => {
  console.log(`Feathers server listening on port http://127.0.0.1:${port}`);
});

process.on('SIGINT', function() {
  console.error('Caught SIGINT, shutting down.');
  server.close();
});
