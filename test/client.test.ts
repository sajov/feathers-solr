import assert from 'assert';
import { solrClient } from '../src/client';
import Solr from '../src/';

const options = {
  host: 'http://localhost:8983/solr',
  core: 'gettingstarted'
}

const Client = solrClient(options);
const Service = Solr(options);

describe('Client', () => {
  describe('\'methods\' ', () => {
    it('get `select`', async () => {
      const { responseHeader, response } = await Client.get(`/${options.core}/select`, { "q": "*:*" });
      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    });

    it('post `query`', async () => {
      const {responseHeader, response} = await Client.post(`/${options.core}/query`, { "query": "*:*" });
      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    });
  });
})

describe('Service', () => {
  describe('\'client\' ', () => {
    it('get `query`', async () => {
      const {responseHeader, response}  = await Service.client.get(`/${options.core}/query`, { "q": "*:*" });
      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    })

    it('get `select`', async () => {
      const {responseHeader, response}  = await Service.client.get(`/${options.core}/select`, { "q": "*:*" });
      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    })

    it('post `query`', async () => {
      const {responseHeader, response}  = await Service.client.post(`/${options.core}/query`, { "query": "*:*" });
      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    })

    it('post `select`', async () => {
      const {responseHeader, response}  = await Service.client.post(`/${options.core}/select`, { "query": "*:*" });
      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    })
  });

//   describe('\'client\' ', () => {
//     // it('get', async () => {
//     //   const result = await Client.get('/gettingstarted/select', { "q": "*:*" })
//     //   console.log(result)
//     //   assert.strictEqual(40, 40);
//     // });

//     // it('post', async () => {
//     //   const result = await Client.post('/gettingstarted/query', { "query": "*:*" })
//     //   console.log(result)
//     //   assert.strictEqual(40, 40);
//     // });
//   });
})
