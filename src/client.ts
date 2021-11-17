import http from 'http';
// import https from 'https';
// import url from 'url';


// https://nodejs.org/api/querystring.html
// https://www.digitalocean.com/community/tutorials/how-to-create-an-http-client-with-core-http-in-node-js
// https://stackoverflow.com/questions/45778474/proper-request-with-async-await-in-node-js

export interface RequestOptions extends http.RequestOptions {
  params?: any;
  data?: any;
}

export interface SolrClient {
  get: (resource: string, options: RequestOptions) => Promise<any>;
  post: (resource: string, options: RequestOptions) => Promise<any>;
}

export interface SolrClientOptions {
  host: string;
  core: string;
}

export const solrClient = (requestOptions: SolrClientOptions): SolrClient => {


  // const { schema } = url.UrlWithStringQuery(options.host);
  // const transport = schema === 'http' ? http : https;

  const transport = http;

  const opts = {
    timeout: 1000,
    ...requestOptions
  }
  console.log('!!', opts)

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

  //@ts-ignore
  const request = async (options: any) => {

    const {url, method, params, data} = options;

    const requestOptions = {
      hostname: options.host,
      method: method,
      timeout: opts.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    if(method === 'POST') {
      requestOptions.headers['Content-Length'] = Buffer.byteLength(data);
    } else {

    }

    if(Object.keys(params).length) {
      // create url
    }

    return new Promise((resolve, reject) => {
      const request = transport.request(url, requestOptions, (res: any) => {
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
    get: async (resource: string, options: RequestOptions) => {
      // const { params } = options;
      console.log(options)
      let url = `${opts.host}${resource}`;
      console.log(url)
      // if(Object.keys(params).length > 0) url += `?${new URLSearchParams(params)}`
      // debug(url)
      return await _get(url)
    },
    post: async (resource: string, options: RequestOptions) => {
      const { params, data } = options;
      console.log(options)
      let url = `${opts.host}${resource}`;
      if(Object.keys(params).length > 0) url += `?${new URLSearchParams(params)}`
      const body = JSON.stringify(data);
      console.log(url, body, params)
      return await _post(url, body)
    }
  }
}
