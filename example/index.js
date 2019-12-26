const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const Service = require('../lib');
const fetch = require('node-fetch');
const undici = require('undici');
const { SolrClient } = require('../lib');
const solrServer = 'http://localhost:8983/solr/gettingstarted';

// Create an Express compatible Feathers application instance.
const app = express(feathers());
// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// Enable REST services

// init Adapter witch Fetch
app.use(
  'fetch',
  new Service({
    Model: SolrClient(fetch, solrServer),
    paginate: {},
    events: ['testing']
  })
);
// init Adapter witch Undici
app.use(
  'undici',
  new Service({
    Model: SolrClient(undici, solrServer),
    paginate: {},
    events: ['testing']
  })
);

app.service('fetch').create({
  id: 'TWINX2048-3200PRO',
  name: 'Product One'
});
app.service('undici').create({
  id: 'HELIX1015-1800SL',
  name: 'Product Two'
});
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
