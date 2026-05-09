import assert from 'assert';
import http from 'http';
import { httpClient, SolrHttpError } from '../src/httpClient';

const startServer = (handler: http.RequestListener): Promise<http.Server> =>
  new Promise(resolve => {
    const server = http.createServer(handler);
    server.listen(0, '127.0.0.1', () => resolve(server));
  });

const port = (server: http.Server) => (server.address() as any).port;

describe('httpClient hardening', () => {
  describe('basic auth', () => {
    it('sends Authorization header from URL credentials', async () => {
      let received: string | undefined;
      const server = await startServer((req, res) => {
        received = req.headers.authorization;
        res.setHeader('Content-Type', 'application/json');
        res.end('{}');
      });
      try {
        const client = httpClient(`http://user:secret@127.0.0.1:${port(server)}`);
        await client.get('/anything', {});
        assert.strictEqual(received, `Basic ${Buffer.from('user:secret').toString('base64')}`);
      } finally {
        server.close();
      }
    });

    it('sends Authorization header from requestOptions.auth', async () => {
      let received: string | undefined;
      const server = await startServer((req, res) => {
        received = req.headers.authorization;
        res.setHeader('Content-Type', 'application/json');
        res.end('{}');
      });
      try {
        const client = httpClient(`http://127.0.0.1:${port(server)}`, { auth: 'admin:pw' } as any);
        await client.get('/anything', {});
        assert.strictEqual(received, `Basic ${Buffer.from('admin:pw').toString('base64')}`);
      } finally {
        server.close();
      }
    });

    it('does not send Authorization without credentials', async () => {
      let received: string | undefined;
      const server = await startServer((req, res) => {
        received = req.headers.authorization;
        res.setHeader('Content-Type', 'application/json');
        res.end('{}');
      });
      try {
        const client = httpClient(`http://127.0.0.1:${port(server)}`);
        await client.get('/anything', {});
        assert.strictEqual(received, undefined);
      } finally {
        server.close();
      }
    });
  });

  describe('default timeout', () => {
    it('aborts a hanging request within the user-supplied timeout', async function () {
      this.timeout(5000);
      const server = await startServer(() => {
        // never respond
      });
      try {
        const client = httpClient(`http://127.0.0.1:${port(server)}`, { timeout: 200 });
        await assert.rejects(() => client.get('/hangs', {}), /timed out/);
      } finally {
        server.close();
      }
    });
  });

  describe('connection reuse', () => {
    it('reuses the same TCP socket across requests via keep-alive', async () => {
      const sockets = new Set<unknown>();
      const server = await startServer((req, res) => {
        sockets.add(req.socket);
        res.setHeader('Content-Type', 'application/json');
        res.end('{}');
      });
      try {
        const client = httpClient(`http://127.0.0.1:${port(server)}`);
        await client.get('/a', {});
        await client.get('/b', {});
        await client.get('/c', {});
        assert.strictEqual(sockets.size, 1, 'expected all requests to share one socket');
      } finally {
        server.close();
      }
    });
  });

  describe('error reporting', () => {
    it('exposes Solr error message and body on non-2xx responses', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          responseHeader: { status: 400 },
          error: { code: 400, msg: 'undefined field foo' }
        }));
      });
      try {
        const client = httpClient(`http://127.0.0.1:${port(server)}`);
        await assert.rejects(
          () => client.get('/select', {}),
          (err: any) => {
            assert(err instanceof SolrHttpError);
            assert.strictEqual(err.statusCode, 400);
            assert.strictEqual(err.solrMessage, 'undefined field foo');
            assert.match(err.message, /undefined field foo/);
            assert.deepStrictEqual(err.body.error.code, 400);
            return true;
          }
        );
      } finally {
        server.close();
      }
    });

    it('keeps the raw body when Solr returns non-JSON', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(503, { 'Content-Type': 'text/html' });
        res.end('<html><body>Service Unavailable</body></html>');
      });
      try {
        const client = httpClient(`http://127.0.0.1:${port(server)}`);
        await assert.rejects(
          () => client.get('/select', {}),
          (err: any) => {
            assert(err instanceof SolrHttpError);
            assert.strictEqual(err.statusCode, 503);
            assert.match(err.body, /Service Unavailable/);
            return true;
          }
        );
      } finally {
        server.close();
      }
    });

    it('rejects when a 2xx response carries non-JSON instead of crashing on JSON.parse', async () => {
      const server = await startServer((_req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('not json');
      });
      try {
        const client = httpClient(`http://127.0.0.1:${port(server)}`);
        await assert.rejects(
          () => client.get('/select', {}),
          (err: any) => {
            assert(err instanceof SolrHttpError);
            assert.match(err.message, /non-JSON response/);
            return true;
          }
        );
      } finally {
        server.close();
      }
    });
  });
});
