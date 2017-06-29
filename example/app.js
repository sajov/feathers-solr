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
    host: 'http://localhost:8983/solr',
    core: '/gettingstarted',
    migrate: 'drop',
    paginate: {
        default: 10,
        max: 4
    }
});

app.use('/solr', Service);

// you can pass schema {...} to constructor
// this ist just for adding demo data
app.service('solr').remove(null, {})
    .then(res => {
        app.service('solr').define({
                name: 'text_general',
                company: 'text_general',
                email: 'text_general',
                age:  'int',
                gender: 'string',
                colorolor: {
                    type: 'string',
                    multiValued: true,
                },
                address: {
                    type: 'string',
                    default: 'Düsseldorf'
                }
            })
            .then(res => {
                let demoData = require('./data/json-generator.js')
                app.service('solr').create(demoData)
                    .then(res => {
                        console.log('added demo data')
                    })
                    .catch(err => { console.log('EROOR', err) });
            }).catch(err => { console.log(err) });
    }).catch(err => { console.log(err) });

// Accessing all client methods
// app.service('solr').client().schemaApi()
//       .addDynamicField().then(res => {})
//       .addFieldType().then(res => {})
//       .addCopyField().then(res => {})





app.use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
