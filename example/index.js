//@ts-ignore
const SolrService = require('../lib').SolrService;
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
  core: 'gettingstarted',
  paginate: {
     default: 3
  },
  events: ['testing'],
  // A list of all methods this service exposes externally
  methods: ['find', 'get', 'create', 'update', 'patch', 'remove'],
  // You can add additional custom events to be sent to clients here
  events: [],
  filters: {
    '$params': (value) => value,
    '$facet': (value) => value,
    '$filter': (value) => value,
    '$search': (value) => value
  },
  operators: ['$like','$nlike'],
};

const setupService = (app) => {
  app.use('/products', new SolrService(options));
}

app.configure(setupService)

app.service('products').create({
  id: 'KJHKJT786786hhhg',
  title:'hello world'
}).then(res => console.log({find: res})).catch(err => console.log(err))

// app.service('products').update('KJHKJT786786hhhg', {
//   title:'hi ho'
// },
// {
//   query: {
//     $select: ['id']
//   }
// }
// ).then(res => console.log({find: res})).catch(err => console.log(err))

// app.service('products').find({
//   query: {
//     $select:['id']
//   }
// }).then(res => console.log({find: res})).catch(err => console.log(err))
// app.service('products').find({
//   query: {$search: 'title:hello', $select:['id']},
//   paginate: false
// }).then(res => console.log({get: res})).catch(err => console.log(err))


// Start the server.
const port = 3030;

app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`)
});
