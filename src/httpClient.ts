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
const DEFAULT_KEEP_ALIVE_MSECS = 30000;
const DEFAULT_MAX_SOCKETS = 64;

export class SolrHttpError extends Error {
  statusCode: number;
  url: string;
  body: any;
  solrMessage?: string;

  constructor(message: string, statusCode: number, url: string, body: any) {
    super(message);
    this.name = 'SolrHttpError';
    this.statusCode = statusCode;
    this.url = url;
    this.body = body;
    this.solrMessage = body && body.error && body.error.msg ? body.error.msg : undefined;
  }
}

const tryParseJson = (raw: string): any => {
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

const buildAuthHeader = (auth: string | undefined): Record<string, string> => {
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
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          const parsed = raw.length > 0 ? tryParseJson(raw) : undefined;

          if (res.statusCode < 200 || res.statusCode > 299) {
            logger({ statusCode: res.statusCode, body: parsed });
            const solrMsg = parsed && parsed.error && parsed.error.msg;
            const summary = solrMsg
              ? `Solr ${res.statusCode}: ${solrMsg}`
              : `Solr ${res.statusCode} at ${cleanUrl}`;
            return reject(new SolrHttpError(summary, res.statusCode, cleanUrl, parsed));
          }

          if (parsed === undefined) return resolve({});
          if (typeof parsed === 'string') {
            return reject(new SolrHttpError(
              `Solr returned non-JSON response (${res.statusCode})`,
              res.statusCode,
              cleanUrl,
              parsed
            ));
          }
          resolve(parsed);
        });
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
  const isHttps = new URL(hostname).protocol === 'https:';
  const agentOptions = { keepAlive: true, keepAliveMsecs: DEFAULT_KEEP_ALIVE_MSECS, maxSockets: DEFAULT_MAX_SOCKETS };
  const defaultAgent = isHttps ? new https.Agent(agentOptions) : new http.Agent(agentOptions);
  const baseRequestOptions: http.RequestOptions = { agent: defaultAgent, ...requestOptions };

  function getUrl({ resource, params }: { resource: string; params: any; }): string {
    const url = `${hostname}${resource}`;
    return !params || !Object.keys(params).length ? url : `${url}?${new URLSearchParams(params)}`;
  }

  async function get(resource: string, options: MethodOptions): Promise<unknown> {
    const { params } = options;
    return await request({
      url: getUrl({ resource, params }),
      requestOptions: {
        ...baseRequestOptions,
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
        ...baseRequestOptions,
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
