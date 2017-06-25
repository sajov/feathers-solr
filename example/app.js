const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const feathersSolr = require('../lib/index');
const socketio = require('feathers-socketio');

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(socketio())
  .configure(hooks())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use('/', feathers.static('./public'));


  // Initialize your feathers plugin
  const Service = feathersSolr({
      // conn: {},
      // schema: {},
      // commitStrategy: false,
      paginate: {
        default: 10,
        max: 4
      }
  });

  Service.define({
    description: {
        type: 'string',
        stored: true,
        default:'sajo'
    },
    //  age: {
    //     type: 'tlongs',
    //     stored: true,
    //     default: 10
    // },
    // sometext: {
    //     type: 'string',
    //     stored: true,
    //     default: 'i dont know'
    // },
    // revisits: {
    //     type: 'float',
    //     stored: true
    // },
    location: {
        type: 'string',
        stored: true,
        default: 'Düsseldorf'
    }
  });

  Service.describe();

  app.use('/solr', Service);

  app.use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
