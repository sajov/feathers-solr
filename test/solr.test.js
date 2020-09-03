const feathers = require('@feathersjs/feathers');
const fetch = require('node-fetch');
const undici = require('undici');
const Solr = require('../lib');
const { SolrClient } = require('../lib');
const solrServer = 'http://localhost:8983/solr/gettingstarted';

const app = feathers();

// Http Client Fetch
app.use(
  'fetch',
  new Solr({
    Model: SolrClient(fetch, solrServer),
    paginate: {},
    events: ['testing']
  })
);
const service = app.service('fetch');

// Http Client Undici
app.use(
  'undici',
  new Solr({
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


  describe('Service setup with out a Model', () => {
    it('Should throw an error', async () => {
      const options = {
        paginate: {},
        events: ['testing']
      };
      try {
        // eslint-disable-next-line no-unused-vars
        const client = new Solr(options);

        throw new Error('Should never get here');
      } catch (error) {
        expect(error.name).toBe('Error');
      }
    });

    it('Should be pingable', async () => {
      const response = await service.Model.get('admin/ping');
      expect(response).toBeTruthy();
    });
  });

  describe('Client get', () => {
    it('Unidici should get', async () => {
      const response = await app.service('undici').Model.get('admin/ping');
      expect(response).toBeTruthy();
      expect(response.status).toBe('OK');
    });

    it('Fetch should get', async () => {
      const response = await app.service('fetch').Model.get('admin/ping');
      expect(response).toBeTruthy();
      expect(response.status).toBe('OK');
    });
  });

  describe('Client post', () => {
    it('Unidici should post', async () => {
      const response = await app.service('undici').Model.post('query', { query: '*:*' });
      expect(response).toBeTruthy();
      expect(typeof response.response.numFound).toBe('number');
      expect(typeof response.response.start).toBe('number');
    });
    it('Fetch should post', async () => {
      const response = await app.service('fetch').Model.post('query', { query: '*:*' });
      expect(response).toBeTruthy();
      expect(typeof response.response.numFound).toBe('number');
      expect(typeof response.response.start).toBe('number');
    });
  });

  describe('Service Response', () => {
    it('.find simple ', async () => {
      const response = await service.find({
        query: {},
        paginate: { max: 10, default: 3 }
      });
      expect(response).toBeTruthy();
    });

    it('.find not whitelisted param ', async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await service.find({
          query: { $unknown: 1 },
          paginate: { max: 10, default: 3 }
        });

        throw new Error('Should never get here');
      } catch (error) {
        expect(error.name).toBe('BadRequest');
      }
    });
  });

  describe('Service whitelisted params', () => {
    beforeAll(async () => {
      service.options.multi = ['create', 'remove'];
      await service.Model.post('config', configAdd);
    });

    afterAll(async () => {
      await service.Model.post('config', configDelete);
    });
    it('should accept $search', async () => {
      const result = await service.find({ query: { $search: true } });
      expect(Array.isArray(result)).toBeTruthy();
    });
    it('should accept $suggest', async () => {
      const result = await service.find({ query: { $suggest: 'max' } });
      expect(result).toBeTruthy();
      expect(result.suggest.suggest.max).toBeTruthy();
      expect(result.spellcheck.suggestions.length).toBe(0);
    });
    it('should accept $params', async () => {
      const result = await service.find({ query: { $params: {} } });
      expect(Array.isArray(result)).toBeTruthy();
    });
    it('should accept $facet', async () => {
      const result = await service.find({ query: { $facet: {} } });
      expect(Array.isArray(result)).toBeTruthy();
    });
    it('should accept $populate', async () => {
      const result = await service.find({ query: { $populate: true } });
      expect(Array.isArray(result)).toBeTruthy();
    });
  });

  describe('Solr Schema Api', () => {
    it('Schema - add fields', async () => {
      const response = await service.Model.post('schema', schemaAdd);
      expect(response).toBeTruthy();
    });

    it('Schema has a field type `text_auto`', async () => {
      const response = await service.Model.get('schema/fieldtypes/text_auto');
      expect(response).toBeTruthy();
      expect(response.fieldType.name).toBe('text_auto');
    });

    it('Schema has a field `autocomplete`', async () => {
      const response = await service.Model.get('schema/fields/autocomplete');
      expect(response).toBeTruthy();
      expect(response.field.name).toBe('autocomplete');
    });

    it('Schema - remove fields', async () => {
      const response = await service.Model.post('schema', schemaDelete);
      expect(response).toBeTruthy();
    });
  });

  describe('Solr Config Api', () => {
    it('Config - add RequestHandler and SuggestComponent', async () => {
      const response = await service.Model.post('config', configAdd);
      expect(response).toBeTruthy();
    });

    it('Config has a searchComponent `suggest`', async () => {
      const response = await service.Model.get('config/searchComponent');
      expect(response).toBeTruthy();
      expect(response.config.searchComponent.suggest.name).toBe('suggest');
    });

    it('Config has a requestHandler `suggest`', async () => {
      const response = await service.Model.get('config/requestHandler');
      expect(response).toBeTruthy();
      expect(response.config.requestHandler['/suggest'].name).toBe('/suggest');
    });

    it('Config - remove RequestHandler and SuggestComponent', async () => {
      const response = await service.Model.post('config', configDelete);
      expect(response).toBeTruthy();
    });
  });

  describe('Special query params', () => {
    // beforeEach(done => setTimeout(done, 100));

    beforeAll(async () => {
      service.options.multi = ['create', 'remove'];
      await service.remove(null, { query: { id: '*' } });
      await service.Model.post('config', configAdd);
      await service.Model.post('schema', schemaAdd);
      await service.create(
        [
          {
            name: 'Alice',
            age: 20,
            gender: 'female',
            location_p: '40.659500,-73.948141'
          },
          {
            name: 'Junior',
            age: 10,
            gender: 'male',
            location_p: '40.624978,-73.955815'
          },
          {
            name: 'Doug',
            age: 30,
            gender: 'male',
            location_p: '40.648952,-74.010661'
          }
        ],
        { commit: true }
      );
    });

    afterAll(async () => {
      service.options.multi = ['create', 'remove'];
      await service.Model.post('config', configDelete);
      await service.Model.post('schema', schemaDelete);
    });

    describe('$suggest', () => {
      it('Get Documents', async () => {
        // eslint-disable-next-line no-unused-vars
        const response = await service.find({ query: { $suggest: 'alice' } });
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
        expect(response).toBeTruthy();
        expect(response.length).toBe(2);
        expect(response[0].name).toBe('Doug');
        expect(response[1].name).toBe('Alice');
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
        expect(response).toBeTruthy();
        expect(response.length).toBe(2);
        expect(response[0].name).toBe('Alice');
        expect(response[1].name).toBe('Doug');
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
        expect(response).toBeTruthy();
        expect(response.length).toBe(3);
        expect(response[0].name).toBe('Doug');
        expect(response[1].name).toBe('Alice');
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
        expect(response).toBeTruthy();
        expect(response.total).toBe(3);
        expect(response.data.length).toBe(1);
        expect(response.facets.count).toBe(3);
        expect(response.facets.gender.buckets.length).toBe(2);
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
        expect(response.total).toBe(3);
        expect(response.data.length).toBe(1);
        expect(response.facets.count).toBe(3);
        expect(response.facets.ageAvg = 20).toBeTruthy();
        expect(response.facets.ageSum = 60).toBeTruthy();
      });
    });

    // https://lucene.apache.org/solr/guide/7_7/transforming-result-documents.html#TransformingResultDocuments-_child_-ChildDocTransformerFactory
    describe('$params', () => {
      // https://lucene.apache.org/solr/guide/7_7/spell-checking.html
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

      // https://lucene.apache.org/solr/guide/7_7/suggester.html
      describe('Suggester', () => {
        it('Should have Suggest', async () => {});
      });

      // https://lucene.apache.org/solr/guide/7_7/result-grouping.html
      describe('Grouping', () => {
        it('Should gropup by gender fromat simple', async () => {
          const response = await service.find({
            query: {
              $params: {
                group: true,
                'group.field': 'gender',
                'group.format': 'simple'
              }
            }
          });
          expect(response).toBeTruthy();
          expect(response.gender.matches).toBe(3);
          expect(response.gender.doclist.numFound).toBe(3);
          expect(response.gender.doclist.docs.length).toBe(2);
        });
        it('Should gropup by gender format grouped', async () => {
          const response = await service.find({
            query: {
              $params: {
                group: true,
                'group.field': 'gender'
              }
            }
          });
          expect(response).toBeTruthy();
          expect(response.gender.matches).toBe(3);
          expect(response.gender.groups.length).toBe(2);
        });
      });

      // https://lucene.apache.org/solr/guide/7_7/highlighting.html
      describe('Highlight', () => {
        it('Should highlight', async () => {
          const response = await service.find({
            query: {
              $search: 'doug',
              $params: {
                hl: true,
                'hl.field': 'name'
              }
            },
            paginate: { max: 10, default: 3 }
          });
          expect(response).toBeTruthy();
          expect(typeof response.highlighting).toBe('object');
        });
      });

      // https://lucene.apache.org/solr/guide/7_7/morelikethis.html
      describe('MoreLikeThis', () => {
        it('Should have moreLikeThis', async () => {
          const response = await service.find({
            query: {
              $search: 'male',
              $params: {
                mlt: true,
                'mlt.fl': 'gender'
              }
            },
            paginate: { max: 10, default: 3 }
          });
          expect(response).toBeTruthy();
          expect(typeof response.moreLikeThis).toBe('object');
        });
      });

      // https://lucene.apache.org/solr/guide/7_7/spatial-search.html
      describe('Spartial', () => {
        it('Should have distance', async () => {
          const response = await service.find({
            query: {
              $select: ['*', 'score', '_dist_:geodist()'],
              $params: {
                sfield: 'location_p',
                pt: '40.649558, -73.991815',
                d: 50,
                distanceUnits: 'kilometers',
                sort: 'geodist() asc'
              }
            },
            paginate: { max: 10, default: 3 }
          });
          expect(response).toBeTruthy();
          expect(response.data[0]._dist_ < 2).toBe(true);
          expect(response.data[1]._dist_ < 4).toBe(true);
          expect(response.data[2]._dist_ < 5).toBe(true);
        });
      });
    });
  });
});
