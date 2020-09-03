const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const fetch = require('node-fetch');
const undici = require('undici');
const Solr = require('../lib');
const { SolrClient } = require('../lib');
const solrServer = 'http://localhost:8983/solr/gettingstarted';
const app = feathers();
// init Adapter witch Fetch
app.use(
  'fetch',
  new Solr({
    Model: SolrClient(fetch, solrServer),
    paginate: {},
    events: ['testing']
  })
);
// init Adapter witch Undici
app.use(
  'undici',
  new Solr({
    Model: SolrClient(undici, solrServer),
    paginate: {},
    events: ['testing']
  })
);

describe('Feathers Solr Setup Tests', () => {
  describe('Service setup with out a Model', () => {
    it('Should throw an Error', async () => {
      const options = {
        paginate: {},
        events: ['testing']
      };
      try {
        // eslint-disable-next-line no-unused-vars
        const client = new Solr(options);
        throw new Error('Should never get here');
      } catch (error) {
        assert.strictEqual(error.name, 'Error', 'Got a NotFound Feathers Error');
      }
    });
  });

  describe('Client setup with out a connection', () => {
    it('Should throw an Error', async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const client = SolrClient();
        throw new Error('Should never get here');
      } catch (error) {
        assert.strictEqual(error.name, 'Error', 'Got a NotFound Feathers Error');
      }
    });
    // it('Should throw an Error 500', async () => {
    //   try {
    //     const response = await app.service('fetch').find({
    //       query: {
    //         $search: 'Doug',
    //         $params: {
    //           defType: 'edismax',
    //           qf: 'name^10,age^1,gender'
    //         }
    //       }
    //     });
    //     console.log(response);
    //     throw new Error('Should never get here');
    //   } catch (error) {
    //     assert.strictEqual(error.name, 'Error', 'Got a NotFound Feathers Error');
    //   }
    // });
  });

  describe('Client has methods GET and POST', () => {
    it('Unidici has GET', () => {
      assert.strictEqual(typeof app.service('undici').Model.get, 'function', 'Error', 'Got not a response status');
    });
    it('Unidici has POST', () => {
      assert.strictEqual(typeof app.service('undici').Model.post, 'function', 'Error', 'Got not a response status');
    });
    it('Fetch has GET', () => {
      assert.strictEqual(typeof app.service('fetch').Model.get, 'function', 'Error', 'Got not a response status');
    });
    it('Fetch has POST', () => {
      assert.strictEqual(typeof app.service('fetch').Model.post, 'function', 'Error', 'Got not a response status');
    });
  });

  describe('Client response status', () => {
    const query = {
      $search: 'Doug 20',
      $params: {
        defType: 'edismax',
        qf: 'name^10,age^1,gender'
      }
    };

    it('Fetch get 500', async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await app.service('fetch').find({
          query: query
        });

        throw new Error('Should never get here');
      } catch (error) {
        assert.strictEqual(error.name, 'Server Error', 'Got a NotFound Feathers Error');
      }
    });

    it('Undici get 500', async () => {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await app.service('fetch').find({
          query: query
        });

        throw new Error('Should never get here');
      } catch (error) {
        assert.strictEqual(error.name, 'Server Error', 'Got a NotFound Feathers Error');
      }
    });
  });

  describe('Client can GET', () => {
    it('Undici GET', async () => {
      const response = await app.service('undici').Model.get('admin/ping');
      assert.ok(response);
      assert.strictEqual(response.status, 'OK', 'Got Status 0');
      assert.strictEqual(response.responseHeader.status, 0, 'Got QTime 0');
    });
    it('Fetch GET', async () => {
      const response = await app.service('fetch').Model.get('admin/ping');
      assert.ok(response);
      assert.strictEqual(response.status, 'OK', 'Got Status 0');
      assert.strictEqual(response.responseHeader.status, 0, 'Got QTime 0');
    });
  });

  describe('Client can POST', () => {
    const data = [{ test_s: 'sajo' }];
    it('Undici POST', async () => {
      const response = await app.service('undici').Model.post('update/json', data);
      assert.ok(response);
      assert.strictEqual(response.responseHeader.status, 0, 'Got Status 0');
    });
    it('Fetch POST', async () => {
      const response = await app.service('fetch').Model.post('update/json', data);
      assert.ok(response);
      assert.strictEqual(response.responseHeader.status, 0, 'Got Status 0');
    });
  });
});
