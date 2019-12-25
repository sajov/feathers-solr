const assert = require('assert');
const adapterTests = require('@feathersjs/adapter-tests');
const errors = require('@feathersjs/errors');
const feathers = require('@feathersjs/feathers');
const solr = require('../lib');
const { fetchClient, undiciClient } = require('../lib');
const solrServer = 'http://localhost:8983/solr/gettingstarted';

const options = {
  Model: new fetchClient(solrServer),
  paginate: {},
  events: ['testing']
};

const app = feathers().use('fetch', new solr(options));
const service = app.service('fetch');
app.use(
  'undici',
  new solr({
    Model: new undiciClient(solrServer),
    paginate: {},
    events: ['testing']
  })
);

const configAdd = require('./solr/config-add.json');
const configDelete = require('./solr/config-delete.json');
const schemaAdd = require('./solr/schema-add.json');
const schemaDelete = require('./solr/schema-delete.json');

describe('Feathers Solr Setup Tests', () => {
  // beforeEach(done => setTimeout(done, 10));

  before(async function() {});

  describe('Service setup with out a Model', () => {
    it('Should throw an error', async () => {
      const options = {
        paginate: {},
        events: ['testing']
      };
      try {
        const client = new solr(options);

        throw new Error('Should never get here');
      } catch (error) {
        assert.strictEqual(error.name, 'Error', 'Got a NotFound Feathers error');
      }
    });

    it('Should be pingable', async () => {
      const response = await service.Model.get('admin/ping');
      assert.ok(response);
    });
  });

  describe('Client setup with out a connection', () => {
    it('Unidici should throw an error', async () => {
      try {
        new undiciClient();

        throw new Error('Should never get here');
      } catch (error) {
        assert.strictEqual(error.name, 'Error', 'Got a NotFound Feathers error');
      }
    });

    it('Fetch should throw an error', async () => {
      try {
        new fetchClient();

        throw new Error('Should never get here');
      } catch (error) {
        assert.strictEqual(error.name, 'Error', 'Got a NotFound Feathers error');
      }
    });
  });

  describe('Client get', () => {
    it('Unidici should get', async () => {
      const response = await app.service('undici').Model.get('admin/ping');
      assert.ok(response, 'Error', 'Got no ping result');
      assert.strictEqual(response.status, 'OK', 'Error', 'Got not a response status');
    });

    it('Fetch should get', async () => {
      const response = await app.service('fetch').Model.get('admin/ping');
      assert.ok(response, 'Error', 'Got no ping result');
      assert.strictEqual(response.status, 'OK', 'Error', 'Got not a response status');
    });
  });

  describe('Client post', () => {
    it('Unidici should post', async () => {
      const response = await app.service('undici').Model.post('query', { query: '*:*' });
      assert.ok(response, 'Error', 'Got a NotFound Feathers error');
      assert.strictEqual(response.response.numFound, 0, 'Error', 'Got a NotFound Feathers error');
    });

    it('Fetch should post', async () => {
      const response = await app.service('fetch').Model.post('query', { query: '*:*' });
      assert.ok(response, 'Error', 'Got a NotFound Feathers error');
      assert.strictEqual(response.response.numFound, 0, 'Error', 'Got a NotFound Feathers error');
    });
  });

  describe('Service Response', () => {
    it('.find simple ', async () => {
      const response = await service.find({
        query: {},
        paginate: { max: 3, default: 4 }
      });
      assert.ok(response);
    });

    it('.find not whitelisted param ', async () => {
      try {
        const response = await service.find({
          query: { $unknown: 1 },
          paginate: { max: 3, default: 4 }
        });

        throw new Error('Should never get here');
      } catch (error) {
        assert.strictEqual(error.name, 'BadRequest', 'Got a NotFound Feathers error');
      }
    });
  });

  describe('Service whitelisted params', () => {
    before(async () => {
      service.options.multi = ['create', 'remove'];
      await service.Model.post('config', configAdd);
    });

    after(async () => {
      await service.Model.post('config', configDelete);
    });
    it('should accept $search', async () => {
      const result = await service.find({ query: { $search: true } });
      assert.ok(Array.isArray(result), 'result is array');
    });
    it('should accept $suggest', async () => {
      const result = await service.find({ query: { $suggest: 'max' } });
      assert.ok(result, 'result is array');
      assert.ok(result.suggest.suggest.max, 'result is array');
      assert.strictEqual(result.spellcheck.suggestions.length, 0, 'result is array');
    });
    it('should accept $params', async () => {
      const result = await service.find({ query: { $params: {} } });
      assert.ok(Array.isArray(result), 'result is array');
    });
    it('should accept $facet', async () => {
      const result = await service.find({ query: { $facet: {} } });
      assert.ok(Array.isArray(result), 'result is array');
    });
    it('should accept $populate', async () => {
      const result = await service.find({ query: { $populate: true } });
      assert.ok(Array.isArray(result), 'result is array');
    });
  });
});

describe('Feathers Solr Config + Schema test', function() {
  // beforeEach(done => setTimeout(done, 100));

  before(async () => {
    service.options.multi = ['create', 'remove'];
    await service.Model.post('config', configAdd);
    await service.Model.post('schema', schemaAdd);
  });

  after(async () => {
    await service.Model.post('config', configDelete);
    await service.Model.post('schema', schemaDelete);
  });

  beforeEach(async () => {
    await service.create([
      {
        name: 'Alice',
        age: 20,
        gender: 'female'
      },
      {
        name: 'Junior',
        age: 10,
        gender: 'male'
      },
      {
        name: 'Doug',
        age: 30,
        gender: 'male'
      }
    ]);
  });

  afterEach(async () => {
    await service.remove(null, { query: { id: '*' } });
  });

  describe('Solr Schema', function() {
    it('Schema has a field type `text_auto`', async () => {
      const response = await service.Model.get('schema/fieldtypes/text_auto');
      assert.ok(response);
      assert.strictEqual(response.fieldType.name, 'text_auto', 'Got a field named text_auto');
    });

    it('Schema has a field `autocomplete`', async () => {
      const response = await service.Model.get('schema/fields/autocomplete');
      assert.ok(response);
      assert.strictEqual(response.field.name, 'autocomplete', 'Got a field named autocomplete');
    });
  });

  describe('Solr Config', function() {
    it('Config has a searchComponent `suggest`', async () => {
      const response = await service.Model.get('config/searchComponent');
      assert.ok(response);
      assert.strictEqual(response.config.searchComponent.suggest.name, 'suggest', 'Got a field named autocomplete');
    });

    it('Config has a requestHandler `suggest`', async () => {
      const response = await service.Model.get('config/requestHandler');
      assert.ok(response);
      assert.strictEqual(response.config.requestHandler['/suggest'].name, '/suggest', 'Got a field named autocomplete');
    });
  });

  describe('Solr Suggest', function() {
    it('Get Documents', async () => {
      const response = await service.find({});
      assert.ok(response);
      assert.strictEqual(response.length, 3, 'Got 3 documents');
    });

    it('Get Suggestions direct call', async () => {
      const response = await service.Model.get('suggest', { q: 'Doug' });
      assert.ok(response);
      assert.strictEqual(response.spellcheck.suggestions.length, 0, 'Got 3 documents');
    });
  });

  describe('Query $facet', () => {
    it('$facet - type terms', async () => {
      const response = await service.find({
        query: {
          $facet: {
            gender: {
              type: 'terms',
              field: 'gender'
            }
          }
        },
        paginate: { max: 10, default: 1 }
      });
      assert.ok(response);
      assert.strictEqual(response.total, 3, 'Got 3 entries');
      assert.strictEqual(response.data.length, 1, 'Got one entry');
      assert.strictEqual(response.facets.count, 3, 'Got 3 entries');
      assert.strictEqual(response.facets.gender.buckets.length, 2, 'Got 2 entries');
    });
    it('$facet - aggresgation', async () => {
      const response = await service.find({
        query: {
          $facet: {
            ageAvg: 'avg(age)',
            ageSum: 'sum(age)'
          }
        },
        paginate: { max: 10, default: 1 }
      });
      assert.strictEqual(response.total, 3, 'Got 3 entries');
      assert.strictEqual(response.data.length, 1, 'Got one entry');
      assert.strictEqual(response.facets.count, 3, 'Got 3 entries');
      assert.ok((response.facets.ageAvg = 20), 'age AGV is 20');
      assert.ok((response.facets.ageSum = 60), 'age SUM is 60');
    });
  });

  describe('Query $params search relevance', () => {
    it('$params - edismax', async () => {
      const response = await service.find({
        query: {
          $search: 'Doug~',
          $params: {
            edismax: 'true',
            qf: 'name^10,age^1,gender'
          }
        },
        paginate: { max: 10, default: 1 }
      });
      console.log(response);
      assert.ok(response);
    });
  });
});
