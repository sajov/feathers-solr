const assert = require('assert');
const adapterTests = require('@feathersjs/adapter-tests');
const errors = require('@feathersjs/errors');
const feathers = require('@feathersjs/feathers');
const { fetchClient, undiciClient } = require('../lib');
const solr = require('../lib');
const configAdd = require('./solr/config-add.json');
const configDelete = require('./solr/config-delete.json');
const schemaAdd = require('./solr/schema-add.json');
const schemaDelete = require('./solr/schema-delete.json');
const app = feathers();

// Http Client Fetch
let options = {
  Model: new fetchClient('http://localhost:8983/solr/gettingstarted'),
  paginate: {},
  events: ['testing']
};
app.use('fetch', new solr(options));
const service = app.service('fetch');

// Http Client Undici
options = {
  Model: new undiciClient('http://localhost:8983/solr/gettingstarted'),
  paginate: {},
  events: ['testing']
};
app.use('undici', new solr(options));

const tests = [
  '.options',
  '.events',
  '._get',
  '._find',
  '._create',
  '._update',
  '._patch',
  '._remove',
  '.get',
  '.get + $select',
  '.get + id + query',
  '.get + NotFound',
  '.get + id + query id',
  '.find',
  '.remove',
  '.remove + $select',
  '.remove + id + query',
  '.remove + multi',
  '.remove + id + query id',
  '.update',
  '.update + $select',
  '.update + id + query',
  '.update + NotFound',
  '.update + id + query id',
  '.patch',
  '.patch + $select',
  '.patch + id + query',
  '.patch multiple',
  '.patch multi query',
  '.patch + NotFound',
  '.patch + id + query id',
  '.create',
  '.create + $select',
  '.create multi',
  'internal .find',
  'internal .get',
  'internal .create',
  'internal .update',
  'internal .patch',
  'internal .remove',
  '.find + equal',
  '.find + equal multiple',
  '.find + $sort',
  '.find + $sort + string',
  '.find + $limit',
  '.find + $limit 0',
  '.find + $skip',
  '.find + $select',
  '.find + $or',
  '.find + $in',
  '.find + $nin',
  '.find + $lt',
  '.find + $lte',
  '.find + $gt',
  '.find + $gte',
  '.find + $ne',
  '.find + $gt + $lt + $sort',
  '.find + $or nested + $sort',
  '.find + paginate',
  '.find + paginate + $limit + $skip',
  '.find + paginate + $limit 0',
  '.find + paginate + params'
];
const testSuite = adapterTests(tests);

describe('Feathers Solr Service Common Adapter Tests', () => {
  beforeEach(done => setTimeout(done, 100));

  before(async () => {
    service.options.multi = ['create', 'remove'];
    await service.Model.post('config', configAdd);
    await service.Model.post('schema', schemaAdd);
    // TODO: fix Multiple
    await service.create({
      name: 'Alice',
      age: 20,
      gender: 'female'
    });
    await service.create({
      name: 'Junior',
      age: 10,
      gender: 'male'
    });
    await service.create({
      name: 'Doug',
      age: 30,
      gender: 'male'
    });
  });

  after(async () => {
    await service.remove(null, { query: { id: '*' } });
    await service.Model.post('config', configDelete);
    await service.Model.post('schema', schemaDelete);
  });

  beforeEach(async () => {});

  afterEach(async () => {});
});
describe('Feathers Solr Service Common Adapter Tests', () => {
  before(async () => {
    service.options.multi = ['create', 'remove'];
    await service.Model.post('config', configAdd);
    await service.Model.post('schema', schemaAdd);
    await service.remove(null, { query: { id: '*' } });
  });

  after(async () => {
    await service.Model.post('config', configDelete);
    await service.Model.post('schema', schemaDelete);
  });
  testSuite(app, errors, 'fetch');
  testSuite(app, errors, 'undici');
});
