//@ts-ignore
const SolrService = require('../lib').SolrService;
const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const httpClient = require('../lib/httpClient').httpClient;
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
const Client = httpClient(options.host);

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
    Client.get('/admin/cores', {
      params: {
          'action': 'CREATE',
          'name': 'example',
          'config': 'solrconfig.xml',
          'dataDir': 'data',
          'configSet': '_default'
      }
    })
    .then(res => {
      Client.post(`/${options.core}/schema`, {
        data: {
          'add-field': [
            {
              'name': 'name',
              'type': 'string',
              'multiValued': false,
              'indexed': false,
              'stored': true
            },
            {
              'name': 'city',
              'type': 'string',
              'multiValued': false,
              'indexed': false,
              'stored': true
            },
            {
              'name': 'age',
              'type': 'plong',
              'multiValued': false,
              'indexed': false,
              'stored': true
            },
            {
              'name': 'created',
              'type': 'boolean',
              'multiValued': false,
              'indexed': true,
              'stored': true
            }
          ],
          'add-copy-field': [
            { 'source': 'city', 'dest': '_text_' },
            { 'source': 'name', 'dest': '_text_' },
            { 'source': 'age', 'dest': '_text_' }
          ]
        }
      })
      .then(res2 => {
        console.log(res2)
        return  res
      })
      .catch(error => console.log(error));
    })
    .catch(error => console.log(error));

  console.log(`Feathers server listening on port ${port}`)
});
