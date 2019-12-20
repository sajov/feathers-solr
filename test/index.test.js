const assert = require('assert');
const adapterTests = require('@feathersjs/adapter-tests');
const errors = require('@feathersjs/errors');
const feathers = require('@feathersjs/feathers');

const solr = require('../lib');
const Client = require('../lib').Client;
const ClientUndici = require('../example/client-undici');
const options = {
  Model: new Client('http://localhost:8983/solr/techproducts'),
  paginate: {},
  events: ['testing']
};
const app = feathers().use('fetch', new solr(options));
const service = app.service('fetch');

// Http Client Undici
options.Model = new ClientUndici('http://localhost:8983/solr/techproducts');
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
  // beforeEach(done => setTimeout(done, 10));

  before(function(done) {
    Promise.all([
      service.Model.post('schema/fields', {
        'add-field': {
          name: 'name',
          type: 'text_general',
          multiValued: false,
          indexed: true,
          stored: true
        }
      }),
      service.Model.post('schema/fields', {
        'add-field': {
          name: 'age',
          type: 'pint',
          multiValued: false,
          indexed: true,
          stored: true
        }
      }),
      service.Model.post('schema/fields', {
        'add-field': {
          name: 'created',
          type: 'boolean',
          multiValued: false,
          indexed: true,
          stored: true
        }
      })
    ])
      .then(result => {
        done();
      })
      .catch(error => {
        done();
      });
  });

  it('is CommonJS compatible', () => assert.strictEqual(typeof require('../lib'), 'function'));

  describe('Prepare Adapter Tests', () => {
    it('.delete multi ', async () => {
      service.options.multi = ['remove'];
      await service.remove(null, { query: { id: '*' } });
      service.options.multi = false;
      const result = await service.find({});
      assert.ok(Array.isArray(result), 'data is an array');
      assert.ok(result.length == 0, 'data is empty');
    });

    it('has fields name', async () => {
      const response = await service.Model.get('schema/fields/name');
      assert.ok(response.field.name == 'name', 'field name exists');
    });

    it('has fields age', async () => {
      const response = await service.Model.get('schema/fields/age');
      assert.ok(response.field.name == 'age', 'field age exists');
    });

    it('has fields created', async () => {
      const response = await service.Model.get('schema/fields/created');
      assert.ok(response.field.name == 'created', 'field created exists');
    });
  });

  testSuite(app, errors, 'fetch');
  testSuite(app, errors, 'undici');
});
