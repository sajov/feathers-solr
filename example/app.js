const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const feathersSolr = require('../lib/index');

// Initialize the application
const app = feathers()
  .configure(rest())
  .configure(hooks())
  // Needed for parsing bodies (login)
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }));
  // Initialize your feathers plugin
  const Service = feathersSolr({
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
