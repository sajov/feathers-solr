const assert = require('assert');
const adapterTests = require('@feathersjs/adapter-tests');
const errors = require('@feathersjs/errors');
const feathers = require('@feathersjs/feathers');

const solr = require('../lib');
const Client = require('../lib').Client;
const options = {
  Model: new Client('http://localhost:8983/solr/techproducts'),
  paginate: {},
  events: ['testing']
};

const app = feathers().use('techproducts', new solr(options));
const service = app.service('techproducts');

describe('Feathers Solr Service Core Tests', () => {
  // beforeEach(done => setTimeout(done, 10));

  before(async function() {});

  describe('Setup Service with out a Model', () => {
    it('should throw an error', async () => {
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
  });

  describe('Test Techproducts Response', () => {
    it('.find simple ', async () => {
      const response = await service.find({
        query: {},
        paginate: { max: 3, default: 4 }
      });
      // console.log(response);
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

  describe('Whitelisted params', () => {
    it('should accept $search', async () => {
      const result = await service.find({ query: { $search: true } });
      assert.ok(Array.isArray(result), 'result is array');
    });
    it('should accept $suggest', async () => {
      const result = await service.find({ query: { $suggest: true } });
      assert.ok(Array.isArray(result), 'result is array');
    });
    it('should accept $params', async () => {
      const result = await service.find({ query: { $params: true } });
      assert.ok(Array.isArray(result), 'result is array');
    });
    it('should accept $facet', async () => {
      const result = await service.find({ query: { $facet: true } });
      assert.ok(Array.isArray(result), 'result is array');
    });
    it('should accept $populate', async () => {
      const result = await service.find({ query: { $populate: true } });
      assert.ok(Array.isArray(result), 'result is array');
    });
  });

  describe('Test Query Parser', () => {
    it('.find + $search ', async () => {
      const response = await service.find({
        query: {
          $select: ['name', 'age'],
          $search: 'CORSAIR',
          popularity: {
            $in: [2, 5]
          },

          $sort: { name: 1 }
        },
        paginate: { max: 3, default: 4 }
      });
      console.log(response);
      assert.ok(response);
    });

    it('.find + $search ', async () => {
      try {
        const response = await service.find({
          query: {
            $select: ['name', 'age'],
            $search: 'CORSAIR',
            popularity: {
              $in: [2, 5]
            },
            unknown: true,
            $sort: { name: 1 }
          },
          paginate: { max: 3, default: 4 }
        });

        throw new Error('Should never get here');
      } catch (error) {
        assert.strictEqual(error.name, 'Bad Request', 'Got a Bad Request Feathers error');
      }
    });
  });
});
