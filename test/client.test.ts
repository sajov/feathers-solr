import assert from 'assert';
import Solr from '../src';
import { solrClient } from '../src/client';
import { createCore, deleteCore, addSchema, deleteSchema } from './seed';

const options = {
  host: 'http://localhost:8983/solr',
  core: 'test'
}

const Client = solrClient(options.host);

describe('client', () => {
  beforeEach(done => setTimeout(done, 100));

  before(async () => {
    await Client.get('/admin/cores', {params: {
      ...createCore,
      name: options.core
    }});
    await Client.post(`/${options.core}/schema`, {data: addSchema});
    await  Solr({ ...options, multi: true })._remove(null, {});
  });



  after(async () => {
    await  Solr({ ...options, multi: true })._remove(null, {});
    await Client.post(`/${options.core}/schema`, {data: deleteSchema});
    await Client.get('/admin/cores', {params: {
      ...deleteCore,
      core: options.core
    }});
  });

  describe('\'methods\' ', () => {
    it('get `select`', async () => {
      const { responseHeader, response } = await Client.get(`/${options.core}/select`, { params: { 'q': '*:*' } });
      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    });

    it('post `query`', async () => {
      const {responseHeader, response} = await Client.post(`/${options.core}/query`, { data: { 'query': '*:*' } } );
      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    });
  });

});
