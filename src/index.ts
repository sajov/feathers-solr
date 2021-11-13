import { NotFound } from '@feathersjs/errors';
import { _ } from '@feathersjs/commons';
import { AdapterService, ServiceOptions, InternalServiceMethods, AdapterParams } from '@feathersjs/adapter-commons';
import { NullableId, Id } from '@feathersjs/feathers';
import { solrClient, SolrClient } from './client';
import { responseFind } from './response';
import { addIds, jsonQuery } from './query';
export const escapeFn = (key: string, value: any) => {
  return {key, value}
}

export interface SolrServiceOptions extends ServiceOptions {
  host: string
  core: string;
  commit?: {
    softCommit?: boolean,
    commitWithin?: number,
    overwrite?: boolean
  };
  suggestHandler?: string;
  defaultSearch?: any,
  defaultParams?: any,
  createUUID?: boolean;
  escapeFn?: (key: string, value: any) => {key: string, value: any};
}

export class Service<T = any, D = Partial<T>> extends AdapterService<T, D> implements InternalServiceMethods<T> {
  options!: SolrServiceOptions;
  client: SolrClient;
  queryHandler: string;
  updateHandler: string;

  constructor (options: Partial<SolrServiceOptions> = {}) {
    super(_.extend({
      id: 'id',
      commit: {
        softCommit: true,
        commitWithin: 10000,
        overwrite: true
      },
      suggestHandler: 'suggest',
      defaultSearch: {},
      defaultParams: {
        echoParams: 'none'
        // debug:"all"
      },
      createUUID: true,
      escapeFn
    }, options));

    const {host, core} = options;
    this.queryHandler = `/${core}/query`
    this.updateHandler = `/${core}/update/json`

    //@ts-ignore  SolrClientOptions ??
    this.client = solrClient({host, core})
  }

  async _find (params: AdapterParams = {}) {
    const { query, filters, paginate } = this.filterQuery(params);

    if (filters.$sort !== undefined) {
    }

    if (filters.$skip !== undefined) {
    }

    if (filters.$limit !== undefined) {
    }

    try {
      const solrQuery = jsonQuery(null, filters, query, paginate, this.options.escapeFn);
      console.log(solrQuery,'solrQuerysolrQuerysolrQuerysolrQuerysolrQuery')
      const response = await this.client.post(this.queryHandler, solrQuery)
       // const result = {
      //   total,
      //   limit: filters.$limit,
      //   skip: filters.$skip || 0,
      //   data: []
      // };

      const result = responseFind(query, filters, paginate, response);

      // if (!(paginate && (paginate ).default)) {
      //   //@ts-ignore
      //   return result.data;
      // }

      return result;

    } catch (error) {
        console.log(error)
    }

  }
  //@ts-ignore
  async _get (id: Id, params: AdapterParams = {}) {
    //@ts-ignore
    const { query } = this.filterQuery(params);
    try {
      const result = { email: 'john@gmail.com', id: 'LYjqYywedn7C5gnB' }
      return  result;
    } catch (error) {

      throw new NotFound(`No record found for id '${id}'`);
    }
  }

  //@ts-ignore
  async _create (data: Partial<T> | Partial<T>[], params: AdapterParams = {}): Promise<T | T[]> {

    let dataToCreate = Array.isArray(data) ? data : [data];

    if(this.options.createUUID) {
      dataToCreate = addIds(dataToCreate, this.options.id);
    }

    const result = await this.client.post(this.updateHandler, dataToCreate, this.options.commit)

    return result;
  }

  //@ts-ignore
  async _update (id: NullableId, data: T, params: AdapterParams = {}) {

    return data;
  }

  //@ts-ignore
  async _patch (id: NullableId, data: Partial<T>, params: AdapterParams = {}) {
    return data;// Will throw an error if not found
  }

  //@ts-ignore
  async _remove (id: NullableId, params: AdapterParams = {}): Promise<T|T[]> {
    //@ts-ignore
    return {};
  }
}

export default function service (options: Partial<SolrServiceOptions> = {}) {
  return new Service(options);
}
