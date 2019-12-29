const assert = require('assert');
const { _ } = require('@feathersjs/commons');
const feathers = require('@feathersjs/feathers');
const fetch = require('node-fetch');
const undici = require('undici');
const solr = require('../lib');
const { SolrClient } = require('../lib');
const solrServer = 'http://localhost:8983/solr/gettingstarted';

const app = feathers();

// Http Client Fetch
app.use(
  'fetch',
  new solr({
    Model: SolrClient(fetch, solrServer),
    paginate: {},
    events: ['testing']
  })
);
const service = app.service('fetch');

// Http Client Undici
app.use(
  'undici',
  new solr({
    Model: SolrClient(undici, solrServer),
    paginate: {},
    events: ['testing']
  })
);

const configAdd = require('./solr/config-add.json');
const configDelete = require('./solr/config-delete.json');
const schemaAdd = require('./solr/schema-add.json');
const schemaDelete = require('./solr/schema-delete.json');

describe('Additional Adapter Tests', () => {
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
    // it('Unidici should throw an error', async () => {
    //   try {
    //     new undiciClient();
    //     throw new Error('Should never get here');
    //   } catch (error) {
    //     assert.strictEqual(error.name, 'Error', 'Got a NotFound Feathers error');
    //   }
    // });
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
      assert.strictEqual(typeof response.response.numFound, 'number', 'Error', 'Got a NotFound Feathers error');
      assert.strictEqual(typeof response.response.start, 'number', 'Error', 'Got a NotFound Feathers error');
    });
    it('Fetch should post', async () => {
      const response = await app.service('fetch').Model.post('query', { query: '*:*' });
      assert.ok(response, 'Error', 'Got a NotFound Feathers error');
      assert.strictEqual(typeof response.response.numFound, 'number', 'Error', 'Got a NotFound Feathers error');
      assert.strictEqual(typeof response.response.start, 'number', 'Error', 'Got a NotFound Feathers error');
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

  describe('Solr Schema Api', () => {
    it('Schema - add fields', async () => {
      const response = await service.Model.post('schema', schemaAdd);
      assert.ok(response);
    });

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

    it('Schema - remove fields', async () => {
      const response = await service.Model.post('schema', schemaDelete);
      assert.ok(response);
    });
  });

  describe('Solr Config Api', () => {
    it('Config - add RequestHandler and SuggestComponent', async () => {
      const response = await service.Model.post('config', configAdd);
      assert.ok(response);
    });

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

    it('Config - remove RequestHandler and SuggestComponent', async () => {
      const response = await service.Model.post('config', configDelete);
      assert.ok(response);
    });
  });

  describe('Special query params', function() {
    // beforeEach(done => setTimeout(done, 100));

    before(async () => {
      service.options.multi = ['create', 'remove'];
      await service.remove(null, { query: { id: '*' } });
      await service.Model.post('config', configAdd);
      await service.Model.post('schema', schemaAdd);
      await service.create(
        [
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
        ],
        { commit: true }
      );
    });

    after(async () => {
      service.options.multi = ['create', 'remove'];
      await service.Model.post('config', configDelete);
      await service.Model.post('schema', schemaDelete);
    });

    describe('$suggest', function() {
      it('Get Documents', async () => {
        const response1 = await service.find({});
        // console.log(response1);
        const response = await service.find({ query: { $suggest: 'alice' } });
        // console.log(response);
        // console.log();
        // console.log(response.suggest.suggest.alice);
        // assert.ok(response);
        // assert.strictEqual(response.length, 3, 'Got 3 documents');
      });

      // it('Get Suggestions direct call', async () => {
      //   const response = await service.Model.get('suggest', { q: 'Doug' });
      //   assert.ok(response);
      //   assert.strictEqual(response.spellcheck.suggestions.length, 0, 'Got 3 documents');
      // });
    });

    describe('$search', () => {
      it('Should find by `name` and then by `age`', async () => {
        const response = await service.find({
          query: {
            $search: 'Doug 20',
            $params: {
              defType: 'edismax',
              qf: 'name^10 age^1 gender'
            }
          }
        });
        assert.ok(response);
        assert.strictEqual(response.length, 2, 'Got two results');
        assert.strictEqual(response[0].name, 'Doug', 'Doug first');
        assert.strictEqual(response[1].name, 'Alice', 'Alice second');
      });

      it('Should find by `age` and then by `name`', async () => {
        const response = await service.find({
          query: {
            $search: 'Doug 20',
            $params: {
              defType: 'edismax',
              qf: 'name^1 age^10 gender'
            }
          }
        });
        assert.ok(response);
        assert.strictEqual(response.length, 2, 'Got two results');
        assert.strictEqual(response[0].name, 'Alice', 'Alice second');
        assert.strictEqual(response[1].name, 'Doug', 'Doug first');
      });

      it('Should find with default search', async () => {
        service.options.defaultSearch = {
          defType: 'edismax',
          qf: 'name^10 age^1 gender'
        };

        const response = await service.find({
          query: {
            $search: 'Doug 20 male'
          }
        });
        assert.ok(response);
        assert.strictEqual(response.length, 3, 'Got two results');
        assert.strictEqual(response[0].name, 'Doug', 'Doug first');
        assert.strictEqual(response[1].name, 'Alice', 'Alice second');
      });
    });

    describe('$facet', () => {
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

    // https://lucene.apache.org/solr/guide/7_7/transforming-result-documents.html#TransformingResultDocuments-_child_-ChildDocTransformerFactory
    describe('$params', () => {
      describe('Spellchecker', () => {
        it('Should have spellcheck', async () => {
          // const response = await service.find({
          //   query: {
          //     $search: 'Doug 20 male'
          //   }
          // });
          // console.log(response);
          // assert.ok(response);
        });
      });
      describe('Suggester', () => {
        it('Should have Suggest', async () => {});
      });

      // https://lucene.apache.org/solr/guide/7_7/result-grouping.html
      describe('Grouping', () => {
        it('Should gropup by gender fromat simple', async () => {
          const response = await service.find({
            query: {
              $params: {
                'group': true,
                'group.field': 'gender',
                'group.format': 'simple'
              }
            }
          });
          assert.ok(response);
          assert.strictEqual(response.gender.matches, 3);
          assert.strictEqual(response.gender.doclist.numFound, 3, 'Got grouped doclist with numFound');
          assert.strictEqual(response.gender.doclist.docs.length, 2);
        });
        it('Should gropup by gender format grouped', async () => {
          const response = await service.find({
            query: {
              $params: {
                'group': true,
                'group.field': 'gender'
              }
            }
          });
          assert.ok(response);
          assert.strictEqual(response.gender.matches, 3);
          assert.strictEqual(response.gender.groups.length, 2, 'Got grouped doclist with numFound');
        });
      });
      describe('Highlight', () => {
        it('Should highlight', async () => {
          const response = await service.find({
            query: {
              $search: 'doug',
              $params: {
                'hl': true,
                'hl.field': 'name'
              }
            },
            paginate: { max: 3, default: 4 }
          });
          assert.ok(response);
          assert.strictEqual(typeof response.highlighting, 'object');
        });
      });

      // https://lucene.apache.org/solr/guide/7_7/morelikethis.html
      describe('MoreLikeThis', () => {
        it('Should have moreLikeThis', async () => {
          const response = await service.find({
            query: {
              $search: 'male',
              $params: {
                'mlt': true,
                'mlt.fl': 'gender'
              }
            },
            paginate: { max: 3, default: 4 }
          });
          // console.log(response);
          assert.ok(response);
          assert.strictEqual(typeof response.moreLikeThis, 'object');
        });
      });
      describe('Spartial', () => {
        it('Should have distance', async () => {});
      });
    });
  });
});
