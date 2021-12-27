const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const Service = require('../lib/src').Service

// Creates an ExpressJS compatible Feathers application
const app = express(feathers());
// Parse HTTP JSON bodies
app.use(express.json());
// Parse URL-encoded params
app.use(express.urlencoded({ extended: true }));
// Host static files from the current folder
app.use(express.static(__dirname));
// Add REST API support
app.configure(express.rest());
// Register an solr service
app.use('/solr', new Service({
  host: 'http://localhost:8983/solr',
  core: 'gettingstarted',
  multi: false
}));
// Register a nicer error handler than the default Express one
app.use(express.errorHandler());

// Start the server
app.listen(3030, () => {
  console.log(`Feathers server listening on port http://127.0.0.1:3030`);
});
