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

// http://localhost:8983/solr/gettingstarted/suggest?q=Handcrfted&wt=json
app.service('solr').client().schema({
    'delete-field': { name: 'autocomplete' },
        'delete-field-type': { name: 'text_auto' },
        'add-field-type': {
            "name": "text_auto",
            "class": "solr.TextField",
            "positionIncrementGap": "100",
            "analyzer": {
                "tokenizer": {
                    "class": "solr.WhitespaceTokenizerFactory"
                },
                "filters": [{
                    "class": "solr.WordDelimiterFilterFactory",
                    "generateWordParts": "1",
                    "generateNumberParts": "1",
                    "catenateWords": "1",
                    "catenateNumbers": "1",
                    "catenateAll": "1",
                    "splitOnCaseChange": "1"
                }, {
                    "class": "solr.LowerCaseFilterFactory"
                }]
            }
        },
        'add-field': {
            name: 'autocomplete',
            type: 'text_auto',
            indexed: true,
            stored: true,
        },
        'add-field': {
            name: 'autocomplete',
            type: 'text_auto',
            indexed: true,
            stored: true,
        },
        'add-copy-field': {
            'source': '*',
            'dest': 'autocomplete'
        },
});


app.service('solr').client().config({
        // 'delete-searchcomponent': 'suggest',
        // 'delete-requesthandler': '/suggest',
        'add-searchcomponent': {
            'name': 'suggest',
            'class': 'solr.SuggestComponent',
            'suggester': {
                'name': 'suggest',
                'lookupImpl': 'FuzzyLookupFactory',
                'dictionaryImpl': 'DocumentDictionaryFactory',
                'field': 'autocomplete',
                'suggestAnalyzerFieldType': 'string',
                'buildOnStartup': 'true',
                'buildOnCommit': 'true'
            }
        },
        'add-requesthandler': {
            'startup': 'lazy',
            'name': '/suggest',
            'class': 'solr.SearchHandler',
            'defaults': {
                'suggest': 'true',
                'suggest.count': 10,
                'suggest.dictionary': 'suggest',
                'spellcheck': 'on',
                'spellcheck.count': 10,
                'spellcheck.extendedResults': 'true',
                'spellcheck.collate': 'true',
                'spellcheck.maxCollations': 10,
                'spellcheck.maxCollationTries': 10,
                'spellcheck.accuracy': 0.003,
            },
            'components': ['spellcheck', 'suggest']
        }
    })
    .then(res => {
        console.log('?????? res',
            util.inspect(res, showHidden=false, depth=10, colorize=true)
        );
    })
    .catch(err => {
        console.log('?????? err',
            util.inspect(err, showHidden=false, depth=10, colorize=true)
        );
    });
    // you can pass schema {...} to constructor
    // this ist just for adding demo data
    // - remove all data
    // - delete all defined fields
    // - add schema fields
    // - add demo data
// app.service('solr').remove(null, {})
//     .then(res => {
//         app.service('solr').define({
//                 name: 'text_general',
//                 description: 'text_general',
//                 sku: 'text_general',
//                 url: 'string',
//                 price: 'float',
//                 image: 'string',
//                 color: {
//                     type: 'string',
//                     multiValued: true,
//                 },
//                 material: 'string',
//                 adjective: 'text_general',
//                 base_color: 'string',
//                 active: 'boolean',
//                 createdAt: 'date',
//                 updatedAt: 'date'
//             })
//             .then(res => {
//                 // let data = require('./data/json-generator-data.js');
//                 // let data = fakerData.product(50);
//                 let data = require('./data/faker-data.json');
//                 // console.log(data)
//                 app.service('solr').create(data)
//                     .then(res => {
//                         console.log('added demo data')
//                     })
//                     .catch(err => { console.log('EROOR', err) });
//             }).catch(err => { console.log(err) });
//     }).catch(err => { console.log(err) });

// Accessing all client methods
// app.service('solr').client().schemaApi()
//       .addDynamicField().then(res => {})
//       .addFieldType().then(res => {})
//       .addCopyField().then(res => {})





app.use(errorHandler());

app.listen(3030);

console.log('Feathers app started on 127.0.0.1:3030');
