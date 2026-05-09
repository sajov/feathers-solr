import http from 'http';
import https from 'https';

export interface httpClientOptions {
  hostname: string;
  username?: string;
  password?: string;
}

interface MethodOptions {
  params?: any;
  data?: any;
}

export interface HttpClient {
  get: (resource: string, options: MethodOptions) => Promise<any>;
  post: (resource: string, options: MethodOptions) => Promise<any>;
}

export interface RequestOptions {
  url: string;
  requestOptions?: http.RequestOptions | https.RequestOptions;
  data?: any;
  logger?: any;
}

const DEFAULT_TIMEOUT_MS = 60000;

const buildAuthHeader = (auth: string | undefined): { Authorization: string } | {} => {
  if (!auth) return {};
  return { Authorization: `Basic ${Buffer.from(auth).toString('base64')}` };
};

const extractAuthFromUrl = (rawUrl: string): { url: string; auth?: string } => {
  const parsed = new URL(rawUrl);
  if (!parsed.username && !parsed.password) return { url: rawUrl };
  const auth = `${decodeURIComponent(parsed.username)}:${decodeURIComponent(parsed.password)}`;
  parsed.username = '';
  parsed.password = '';
  return { url: parsed.toString(), auth };
};

const request = async (options: RequestOptions) => {
  const { url: rawUrl, data, requestOptions, logger } = options;
  const { method } = requestOptions;
  const { url: cleanUrl, auth: urlAuth } = extractAuthFromUrl(rawUrl);
  const { protocol } = new URL(cleanUrl);
  const transport = protocol === 'https:' ? https : http;
  const auth = (requestOptions as any).auth || urlAuth;

  logger({url: cleanUrl, data});
  return new Promise((resolve, reject): void => {
    const request = transport.request(cleanUrl,
      {
        timeout: DEFAULT_TIMEOUT_MS,
        ...requestOptions,
        headers: {
          ...(method === 'GET' ?
            { 'Content-Type': 'application/json' } :
            { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }),
          ...buildAuthHeader(auth),
          ...((requestOptions as any).headers || {})
        }
      },
      (res: any): void => {
        if (res.statusCode < 200 || res.statusCode > 299) {
          logger({statusCode: res.statusCode});
          return reject(new Error(`HTTP status code ${res.statusCode}`));
        }

        const body: any = [];
        res.on('data', (chunk: any) => body.push(chunk));
        res.on('end', () => resolve(JSON.parse(Buffer.concat(body).toString('utf8'))));
      }
    );

    request.on('error', (err: Error) => {
      logger({err});
      reject(err);
    });

    request.on('timeout', () => {
      request.destroy();
      logger('timeout');
      reject(new Error('timed out'));
    });

    if (data) request.write(data);

    request.end();
  })
}

export const httpClient = (hostname: string, requestOptions: http.RequestOptions = {}, logger: any = () => {}): HttpClient => {

  function getUrl({ resource, params }: { resource: string; params: any; }): string {
    const url = `${hostname}${resource}`;
    return !params || !Object.keys(params).length ? url : `${url}?${new URLSearchParams(params)}`;
  }

  async function get(resource: string, options: MethodOptions): Promise<unknown> {
    const { params } = options;
    return await request({
      url: getUrl({ resource, params }),
      requestOptions: {
        ...requestOptions,
        method: 'GET'
      },
      logger
    });
  }

  async function post(resource: string, options: MethodOptions): Promise<unknown> {
    const { params, data } = options;
    return await request({
      url: getUrl({ resource, params }),
      data: JSON.stringify(data),
      requestOptions: {
        ...requestOptions,
        method: 'POST'
      },
      logger
    });
  }

  return {
    get,
    post
  }
}
