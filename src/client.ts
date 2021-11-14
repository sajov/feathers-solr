import http from 'http';
// import https from 'https';
// import url from 'url';


// https://nodejs.org/api/querystring.html
// https://www.digitalocean.com/community/tutorials/how-to-create-an-http-client-with-core-http-in-node-js
// https://stackoverflow.com/questions/45778474/proper-request-with-async-await-in-node-js

export interface SolrClient {
  get: (resource: string, params?: any) => Promise<any>;
  post: (resource: string, params?: any, data?: any) => Promise<any>;
}

export interface SolrClientOptions {
  host: string;
  core: string;
}

export const solrClient = (options: SolrClientOptions): SolrClient => {


  // const { schema } = url.UrlWithStringQuery(options.host);
  // const transport = schema === 'http' ? http : https;

  const transport = http;

  const opts = {
    timeout: 1000,
    ...options
  }


  const _get = async (url: string) => {

    return new Promise((resolve, reject) => {
      const request = transport.get(url, { timeout: opts.timeout }, (res: any) => {
        if (res.statusCode < 200 || res.statusCode > 299) {
          return reject(new Error(`HTTP status code ${res.statusCode}`))
        }

        let body: any = [];
        res.on('data', (chunk: any) => body.push(chunk))
        res.on('end', () => {
          const response = Buffer.concat(body).toString('utf8')
          resolve(JSON.parse(response))
        })
      })

      request.on('error', (err) => {
        reject(err)
      })
      request.on('timeout', () => {
        request.destroy()
        reject(new Error('timed out'))
      })
    })
  }

  // https://nodejs.org/api/http.html#httprequesturl-options-callback
  const _post = async (url: string, data: any) => {

    return new Promise((resolve, reject) => {
      const request = transport.request(url, {
        method: 'post',
        timeout: opts.timeout,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }, (res: any) => {
        if (res.statusCode < 200 || res.statusCode > 299) {
          return reject(new Error(`HTTP status code ${res.statusCode}`))
        }
        let body: any = [];
        res.on('data', (chunk: any) => body.push(chunk))
        res.on('end', () => {
          const response = Buffer.concat(body).toString('utf8')
          resolve(JSON.parse(response))
        })
      })

      request.on('error', (err) => {
        reject(err)
      })
      request.on('timeout', () => {
        request.destroy()
        reject(new Error('timed out'))
      })
      request.write(data);
      request.end();
    })
  }

  return {
    get: async (resource: string, params: any = {}) => {
      let url = `${options.host}${resource}`;
      if(Object.keys(params).length > 0) url += `?${new URLSearchParams(params)}`
      console.log(url)
      return await _get(url)
    },
    post: async (resource: string, data: any = {}, params: any = {}) => {
      let url = `${options.host}${resource}`;
      if(Object.keys(params).length > 0) url += `?${new URLSearchParams(params)}`
      const body = JSON.stringify(data);
      console.log(url, body, params)
      return await _post(url, body)
    }
  }
}
