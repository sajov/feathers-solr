const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const fetch = require('node-fetch');
const Service = require('../lib');
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

function escapeFn(key, value) {
  const qoutes = (val) => {
    return typeof val === 'string' ? `"${val}"` : val
  };

  return {
    key,
    value: Array.isArray(value) ? value.map(v => qoutes(v)) : qoutes(value)
  };
}

// init Adapter witch Fetch
app.use(
  'gettingstarted',
  new Service({
    Model: SolrClient(fetch, solrServer),
    paginate: {},
    escapeFn: escapeFn,
    events: ['testing'],
    multi: true
  })
);

app.service('gettingstarted').find({
  query: {
    name: 'Product One'
  }
})
.then(res => console.log('key=value',res))
.catch(err => console.log(err))


app.service('gettingstarted').find({
  query: {
    name: {
      $in: ['Product One', 'Product Two']
    }
  }
})
.then(res => console.log('$in',res))
.catch(err => console.log(err))

app.service('gettingstarted').find({
  query: {
    $or: {
      name: 'Product One',
      id: 'TWINX2048-3200PRO'
    }
  }
})
.then(res => console.log('$or',res))
.catch(err => console.log(err))

app.service('gettingstarted').find({
  query: {
    name: {
      $gte: 'Product One'
    }
  }
})
.then(res => console.log('$gte',res))
.catch(err => console.log(err))

// Start the server.
const port = 3030;

const server = app.listen(port, () => {
  console.log(`Feathers server listening on port http://127.0.0.1:${port}`);
});

process.on('SIGINT', function () {
  console.error('Caught SIGINT, shutting down.');
  server.close();
});
