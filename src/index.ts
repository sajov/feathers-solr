import { NotFound, MethodNotAllowed } from '@feathersjs/errors';
import { NullableId, Id } from '@feathersjs/feathers';
import { _ } from '@feathersjs/commons';
import { AdapterService, ServiceOptions, InternalServiceMethods, AdapterParams, select } from '@feathersjs/adapter-commons';
import { solrClient, SolrClient } from './client';
import { responseFind, responseGet } from './response';
import { addIds, jsonQuery, patchQuery, deleteQuery } from './query';
export const escapeFn = (key: string, value: any) => {
  return {key, value}
}

//@ts-ignore
export interface SolrServiceOptions<T = any> extends ServiceOptions {
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
  requestOptions: {timeout: 10}
}

export class Service<T = any, D = Partial<T>> extends AdapterService<T, D> implements InternalServiceMethods<T> {
  options: SolrServiceOptions;
  client: SolrClient;
  queryHandler: string;
  updateHandler: string;

  constructor (options: Partial<SolrServiceOptions<T>> = {}) {
    super(_.extend({
      id: 'id',
      commit: {
        softCommit: true,
        commitWithin: 10000,
        overwrite: true
      },
      suggestHandler: 'suggest',
      defaultSearch: {},
      defaultParams: { echoParams: 'none'},
      createUUID: true,
      escapeFn
    }, options));

    const {host, core, requestOptions} = options;
    this.queryHandler = `/${core}/query`
    this.updateHandler = `/${core}/update/json`

    //@ts-ignore  SolrClientOptions ??
    this.client = solrClient(host, requestOptions)
  }

  _getOrFind (id: Id, params: AdapterParams = {}) {
    if (id === null) {
      return this._find(
        Object.assign(params, {
          paginate: false
        })
      );
    }
    return this._get(id, params);
  }

  async _find (params: AdapterParams = {}) {
    const { query, filters, paginate } = this.filterQuery(params);

    const solrQuery = jsonQuery(null, filters, query, paginate, this.options.escapeFn);

    const response = await this.client.post(this.queryHandler, {data: solrQuery})

    const result = responseFind(filters, query, paginate, response);

    return result;
  }

  async _get (id: Id, params: AdapterParams = {}) {
    const { query, filters, paginate } = this.filterQuery(params);

    const solrQuery = jsonQuery(id, filters, query, paginate, this.options.escapeFn);

    const response = await this.client.post(this.queryHandler, { data: solrQuery })

    if(response.response.numFound === 0) throw new NotFound(`No record found for id '${id}'`);

    const result = responseGet(response, false);

    return  result;
  }

  async _create (data: Partial<T> | Partial<T>[], params: AdapterParams = {}): Promise<T | T[]> {
    const sel = select(params, this.id);

    if (_.isEmpty(data)) throw new MethodNotAllowed('Data is empty');

    let dataToCreate: any | any[] = Array.isArray(data) ? [...data] : [{...data}];

    if(this.options.createUUID) {
      dataToCreate = addIds(dataToCreate, this.options.id);
    }

    await this.client.post(this.updateHandler, {data: dataToCreate, params: this.options.commit});

    return sel(Array.isArray(data) ? dataToCreate : dataToCreate[0]);
  }

  async _update (id: NullableId, data: T, params: AdapterParams = {}) {
    const sel = select(params, this.id);

    const referenceData: any | any[] = await this._getOrFind(id, params);

    if (_.isEmpty(referenceData)) throw new NotFound('No record found');

    const dataToUpdate: any = id && !Array.isArray(data) ? [{id, ...data}] : data;

    await this.client.post(this.updateHandler, {data: dataToUpdate, params: this.options.commit});

    return this._getOrFind(id, params).then(res => sel(_.omit(res, 'score', '_version_')));
  }

  async _patch (id: NullableId, data: Partial<T>, params: AdapterParams = {}) {
    const sel = select(params, this.id);

    const dataToPatch = await this._getOrFind(id, params);

    const { ids, patchData } = patchQuery(dataToPatch, data, this.id);

    await this.client.post(this.updateHandler, {data: patchData, params: this.options.commit});

    const result: any = await this._find({ query: { id: { $in: ids } } });

    return sel(ids.length === 1 ? result[0] : result)
  }

  async _remove (id: NullableId, params: AdapterParams = {}): Promise<T|T[]> {
    const { query } = this.filterQuery(params);

    const sel = select(params, this.id);

    const dataToDelete = await this._getOrFind(id, params);

    const queryToDelete = deleteQuery(id, query, this.options.escapeFn);

    await this.client.post(this.updateHandler, {data: queryToDelete, params: this.options.commit});

    return sel(dataToDelete);
  }
}

export default function service (options: Partial<SolrServiceOptions> = {}) {
  return new Service(options);
}
