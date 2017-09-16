const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');
const bodyParser = require('body-parser');
const errorHandler = require('feathers-errors/handler');
const feathersSolr = require('../lib/index');
const socketio = require('feathers-socketio');
const fakerData = require('./data/faker');
const util = require('util')
// Initialize the application
const app = feathers()
    .configure(rest())
    .configure(socketio())
    .configure(hooks())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use('/', feathers.static('./example/public'));


// Initialize your feathers plugin
const Service = feathersSolr({
    host: 'http://localhost:8983/solr',
    core: '/gettingstarted',
    migrate: 'safe',
    paginate: {
        default: 10,
        max: 100
    }
});

app.use('/solr', Service);

app.use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
