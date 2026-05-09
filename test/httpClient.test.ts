import assert from 'assert';
import http from 'http';
import { httpClient } from '../src/httpClient';

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
});
