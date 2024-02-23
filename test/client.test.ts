// @ts-ignore
import assert from 'assert';
import { SolrService } from '../src';
import { httpClient } from '../src/httpClient';
import { createCore, deleteCore, addSchema, deleteSchema } from './seed';
import { FeathersError } from '@feathersjs/errors';

const options = {
  host: 'http://localhost:8983/solr',
  core: 'test'
}
const Client = httpClient(options.host);

describe('client', () => {

  beforeEach(done => setTimeout(done, 100));

  before(async () => {
    await Client.get('/admin/cores', {
      params: {
        ...createCore,
        name: options.core
      }
    });
    await Client.post(`/${options.core}/schema`, { data: addSchema });
    await new SolrService({ ...options, multi: true })._remove(null, {});
  });

  after(async () => {
    await new SolrService({ ...options, multi: true })._remove(null, {});
    await Client.post(`/${options.core}/schema`, { data: deleteSchema });
    await Client.get('/admin/cores', {
      params: {
        ...deleteCore,
        core: options.core
      }
    });
    // server.close();
    // server.emit('close');
  });

  describe('https', () => {
    it('HTTP', async () => {
      const Client = httpClient('https://jsonplaceholder.typicode.com');

      assert.strictEqual(typeof Client.get, 'function');
      assert.strictEqual(typeof Client.post, 'function');

      const response = await Client.get('/todos', {});

      assert.strictEqual(typeof response[0].title, 'string');
    });
  });


  describe('error handling', () => {
    it('Not Found', async function () {
      this.timeout(10000);
      try {
        const Client = httpClient('http://localhost:8983', { signal: AbortSignal.timeout(10000) });
        await Client.get('/solr/notexist', {})
        throw new Error(`Expected an error and didn't get one!`)
      } catch (error: unknown) {
        return assert.equal((error as FeathersError).code, 404)
      }
    });

    it('TimeoutError', async function () {
      this.timeout(10000);
      try {
        const Client = httpClient('http://localhost:8983', { signal: AbortSignal.timeout(1) });
        await Client.get('/solr/admin/cores', {
          params: {
            ...createCore,
            name: 'test'
          }
        });
        throw new Error(`Expected an error and didn't get one!`)
      } catch (error: unknown) {
        return assert.equal((error as Error).name, 'TimeoutError')
      }
    });

    it('BadRequest', async function () {
      this.timeout(10000);
      try {
        const Client = httpClient('http://localhost:8983', { signal: AbortSignal.timeout(1000) });
        await Client.get('/solr/admin/cores', {
          params: {
            ...createCore,
            'configSet': 'notexists',
            name: 'test'
          }
        });
        throw new Error(`Expected an error and didn't get one!`)
      } catch (error: unknown) {
        return assert.equal((error as FeathersError).code, 500)
      }
    });
  });

  describe('methods', () => {
    it('get `select`', async () => {
      const { responseHeader, response } = await Client.get(`/${options.core}/select`, { params: { 'q': '*:*' } });

      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    });

    it('post `query`', async () => {
      const { responseHeader, response } = await Client.post(`/${options.core}/query`, { data: { 'query': '*:*' } });

      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    });
  });
});
