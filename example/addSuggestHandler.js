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
    core: '/suggest',
    migrate: 'safe',
    paginate: {
        default: 10,
        max: 4
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
    'delete-searchcomponent': 'suggest',
    'delete-requesthandler': '/suggest',
    'add-searchcomponent': {
        'name': 'suggest',
        'class': 'solr.SuggestComponent',
        'suggester': {
            'name': 'suggest',
            'lookupImpl': 'FuzzyLookupFactory',
            'dictionaryImpl': 'DocumentDictionaryFactory',
            'field': 'autocomplete_shingle',
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



app.use(errorHandler());


console.log('done');
