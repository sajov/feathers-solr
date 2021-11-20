import http from 'http';
import https from 'https';

export interface SolrClientOptions {
  hostname: string;
  username?: string;
  password?: string;
}

interface MethodOptions {
  params?: any;
  data?: any;
}

export interface SolrClient {
  get: (resource: string, options: MethodOptions) => Promise<any>;
  post: (resource: string, options: MethodOptions) => Promise<any>;
}

interface RequestOptions {
  url: string;
  requestOptions: http.RequestOptions;
  data?: any;
}

const request = async (options: RequestOptions) => {

  const { url, data, requestOptions } = options;
  const { method } = requestOptions;
  const { protocol } = new URL(url);
  const transport = protocol === 'https:' ? https : http;
  // console.log(options);

  return new Promise((resolve, reject) => {
    const request = transport.request(
      url,
      {
        ...requestOptions,
        headers: method === 'GET' ?
        { 'Content-Type': 'application/json'} :
        { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data)}
      },
      (res: any) => {
        if (res.statusCode < 200 || res.statusCode > 299) {
        return reject(new Error(`HTTP status code ${res.statusCode}`));
      }

      let body: any = [];
      res.on('data', (chunk: any) => body.push(chunk));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(body).toString('utf8'))));
    })

    request.on('error', (err: Error) => reject(err));
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('timed out'));
    })

    if(data) request.write(data);

    request.end();
  })
}

export const solrClient = (hostname: string, requestOptions: http.RequestOptions = {}): SolrClient => {

  const getUrl = (resource:string, params: any) => {
    const url = `${hostname}${resource}`;
    if(!params || !Object.keys(params).length) return url;
    return  `${url}?${new URLSearchParams(params)}`;
  }

  return {
    get: async (resource: string, options: MethodOptions) => {
      const { params } = options;
      return await request({
        url: getUrl(resource, params),
        requestOptions: {
          method: 'GET',
          ...requestOptions,
        }
      });
    },
    post: async (resource: string, options: MethodOptions) => {
      const { params, data } = options;
      return await request({
        url: getUrl(resource, params),
        data: JSON.stringify(data),
        requestOptions: {
          method: 'POST',
          ...requestOptions,
        }
      });
    }
  }
}
