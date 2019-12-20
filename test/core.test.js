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

  describe('Test Query Parser', () => {
    it('.find + $search ', async () => {
      const response = await service.find({
        query: {
          $select: ['name', 'cat'],
          $search: 'CORSAIR',
          popularity: {
            $in: [2, 5]
          },

          $sort: { name: 1 }
        },
        paginate: { max: 3, default: 4 }
      });
      assert.ok(response);
    });

    it('.find + $search ', async () => {
      try {
        const response = await service.find({
          query: {
            $select: ['name', 'cat'],
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

    it('$search ', async () => {
      const response = await service.find({
        query: {
          $search: 'CORSAIR'
        }
      });
      assert.strictEqual(response.length, 2, 'Got two entries');
      assert.strictEqual(response[0].id, 'VS1GB400C3', 'data.id matches');
      assert.ok(response);
    });

    it('$params - example edismax', async () => {
      const response = await service.find({
        query: {
          $params: {
            group: true,
            'group.field': 'manu_id_s'
          }
        },
        paginate: { max: 10, default: 1 }
      });
      assert.ok(response);
      assert.strictEqual(response.data.manu_id_s.matches, 32, 'Got 32 entries');
    });

    it('$facet - type terms', async () => {
      const response = await service.find({
        query: {
          $facet: {
            categories: {
              type: 'terms',
              field: 'cat'
            }
          }
        },
        paginate: { max: 10, default: 1 }
      });
      assert.strictEqual(response.total, 32, 'Got 32 entries');
      assert.strictEqual(response.data.length, 1, 'Got two entries');
      assert.strictEqual(response.facets.count, 32, 'Got 32 entries');
      assert.strictEqual(response.facets.categories.buckets.length, 10, 'Got 10 entries');
      assert.ok(response);
    });

    it('$params - type terms', async () => {
      const response = await service.find({
        query: {
          $search: 'CORSAIR',
          $params: {
            "hl":"on",
            "hl.simple.post":"</i>",
            "hl.fl":"name,cat,manu",
            "hl.simple.pre":"<i>",
          }
        },
        paginate: { max: 10, default: 1 }
      });
      assert.strictEqual(response.highlighting[response.data[0].id].name[0], "<i>CORSAIR</i> ValueSelect 1GB 184-Pin DDR SDRAM Unbuffered DDR 400 (PC 3200) System Memory - Retail", 'Got 32 entries');
      assert.strictEqual(response.highlighting[response.data[0].id].manu[0], "<i>Corsair</i> Microsystems Inc.", 'Got two entries');
      assert.ok(response);
    });


  });
});
