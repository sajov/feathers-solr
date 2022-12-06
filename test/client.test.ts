// @ts-ignore
import assert from 'assert';
import { SolrService } from '../src';
import { httpClient } from '../src/httpClient';
import { createCore, deleteCore, addSchema, deleteSchema } from './seed';
// import https from 'https';
import http from 'http';
function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const requestListener = async function (req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  switch (req.url) {
    case '/timeouts':
      res.writeHead(200);
      await timeout(5000);
      res.end('{"message": "This is a JSON timeouted response"}');
      break
    case '/errors':
      res.writeHead(500);
      res.end('{"message": "This is a JSON errored response"}');
      break
  }
};
function iThrowErrorTimeout() {
  throw new Error('timed out');
}
function iThrowErrorBadRequest() {
  throw new Error('timed out');
}


const options = {
  host: 'http://localhost:8983/solr',
  core: 'test'
}
const Client = httpClient(options.host);

describe('client', () => {
  let server: any = null;

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
    server = http.createServer(requestListener);
    server.listen(3033, 'localhost', () => {});
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
    server.close();
    server.emit('close');
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

  describe('simulate errors', () => {
    it('timeout', async function () {
      this.timeout(10000);
      try {
        const Client = httpClient('http://localhost:3033', { timeout: 2000 });
        await Client.get('/timeouts', {})

      } catch (error) {
        return assert.throws(iThrowErrorTimeout, Error, 'error thrown');
      }
    });

    it('errors', async function () {
      this.timeout(10000);
      try {
        const Client = httpClient('http://localhost:3033', { timeout: 2000 });
        await Client.get('/errors', {})

      } catch (error) {
        return assert.throws(iThrowErrorBadRequest, Error, 'error thrown');
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
