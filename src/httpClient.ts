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

const request = async (options: RequestOptions) => {
  const { url, data, requestOptions, logger } = options;
  const { method } = requestOptions;
  const { protocol } = new URL(url);
  const transport = protocol === 'https:' ? https : http;

  logger({url, data});
  return new Promise((resolve, reject): void => {
    const request = transport.request(url,
      {
        ...requestOptions,
        headers: method === 'GET' ?
          { 'Content-Type': 'application/json' } :
          { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
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
