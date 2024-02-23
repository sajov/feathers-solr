import { convert } from '@feathersjs/errors';

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
  requestOptions?: RequestInit;
  data?: any;
  logger?: any;
}

const request = async (options: RequestOptions) => {
  const { url, data, requestOptions, logger } = options;

  logger({ url, data });

  try {
    const response = await fetch(url, {
      ...requestOptions,
      headers: {
        ...(requestOptions?.headers || {}),
        'Content-Type': 'application/json'
      },
      body: data ? data : undefined
    });

    if (!response.ok) {
      logger({ statusCode: response.status, statusText: response.statusText });
      const error = new Error(`${response.status} ${response.statusText}`);
      error.name = `${response.status}`;
      throw convert(error);
    }

    return response.json();

  } catch (error) {
    logger(error);
    throw error;
  }
};

export const httpClient = (
  hostname: string,
  requestOptions: RequestInit = {},
  logger: any = () => {}
): HttpClient => {
  function getUrl({ resource, params }: { resource: string; params: any }): string {
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
  };
};
