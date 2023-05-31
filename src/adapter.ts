import { BadRequest, MethodNotAllowed, NotFound } from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { httpClient } from './httpClient';
import { addIds } from './utils/addIds';
import { filterResolver } from './utils/filterResolver';
import { convertOperators } from './utils/convertOperators';
import {
  AdapterBase,
  select,
  AdapterParams,
  AdapterServiceOptions,
  PaginationOptions,
  AdapterQuery
} from '@feathersjs/adapter-commons'
import type { NullableId, Id, Paginated } from '@feathersjs/feathers'
import type { HttpClient, RequestOptions } from './httpClient';

export interface SolrAdapterOptions extends AdapterServiceOptions {
  host: string;
  core: string;
  commit?: {
    softCommit?: boolean;
    commitWithin?: number;
    overwrite?: boolean
  };
  queryHandler?: string;
  updateHandler?: string;
  defaultSearch?: any;
  defaultParams?: any;
  createUUID?: boolean;
  requestOptions?: RequestOptions;
  escapeFn?: (key: string, value: any) => { key: string, value: any };
  logger?: (msg: any) => any;
}

export type SolrAdapterParams<Q = AdapterQuery> = AdapterParams<Q, Partial<SolrAdapterOptions>>
type SolrQueryParams = {}
type SolrQueryFacet = {}

export interface SolrQuery {
  query: string;
  fields: string;
  limit: number;
  offset: number;
  sort?: string;
  filter?: string[];
  params?: SolrQueryParams
  facet?: SolrQueryFacet
}

export class SolrAdapter<
  Result,
  Data = Partial<Result>,
  ServiceParams extends SolrAdapterParams<any> = SolrAdapterParams,
  PatchData = Partial<Data>
> extends AdapterBase<Result, Data, PatchData, ServiceParams, SolrAdapterOptions> {
  client: HttpClient;
  queryHandler: string;
  updateHandler: string;

  constructor(options: SolrAdapterOptions) {
    const { host, core, requestOptions, ...opts } = options;
    super(_.extend({
      id: 'id',
      commit: {
        softCommit: true,
        commitWithin: 10000,
        overwrite: true
      },
      queryHandler: '/query',
      updateHandler: '/update/json',
      defaultSearch: {},
      defaultParams: { echoParams: 'none' },
      createUUID: true,
      requestOptions: { timeout: 10 },
      escapeFn: (key: string, value: any) => ({ key, value }),
      logger: (msg: any): any => msg
    }, opts));

    this.queryHandler = `/${core}${this.options.queryHandler}`;
    this.updateHandler = `/${core}${this.options.updateHandler}`;
    this.client = httpClient(host, requestOptions, this.options.logger)
  }

  filterQuery(id: NullableId | Id, params: ServiceParams) {
    const { paginate } = this.getOptions(params);
    const { $search, $params, $select, $filter, $facet, ...adapterQuery } = params.query || {};
    const { $skip, $sort, $limit, ...filter } = adapterQuery;

    return {
      query: {
        query: filterResolver.$search($search),
        fields: filterResolver.$select($select),
        limit: filterResolver.$limit($limit, paginate),
        offset: filterResolver.$skip($skip),
        filter: [
          ...(id ? convertOperators({ [this.options.id]: id }, this.options.escapeFn) : []),
          ...(!_.isEmpty(filter) ? convertOperators(filter, this.options.escapeFn) : []),
          ...($filter ? $filter : [])
        ],
        ...($sort && { sort: filterResolver.$sort($sort) }),
        ...($facet && { facet: $facet }),
        ...($params && { params: $params })
      },
      paginate
    };
  }

  async _getOrFind(id: NullableId | NullableId, params: ServiceParams) {
    if (id !== null) return this._get(id, params);

    return this._find(
      Object.assign(params, { paginate: false })
    );
  }

  async _get(id: Id | NullableId, params: ServiceParams = {} as ServiceParams): Promise<Result> {
    const { query } = this.filterQuery(id, params);
    const { response } = await this.client.post(this.queryHandler, { data: query })

    if (response.numFound === 0) throw new NotFound(`No record found for id '${id}'`);

    return response.docs[0];
  }

  async _find(params?: ServiceParams & { paginate?: PaginationOptions }): Promise<Paginated<Result>>
  async _find(params?: ServiceParams & { paginate: false }): Promise<Result[]>
  async _find(params?: ServiceParams): Promise<Paginated<Result> | Result[]>
  async _find(params: ServiceParams = {} as ServiceParams): Promise<Paginated<Result> | Result[]> {
    const { query, paginate } = this.filterQuery(null, params);
    const {
      responseHeader,
      response,
      grouped, ...additionalResponse
    } = await this.client.post(this.queryHandler, { data: query });
    const groupKey: string = grouped ? Object.keys(grouped)[0] : undefined;
    const data = response ? response.docs : grouped[groupKey].groups || grouped[groupKey].doclist.docs;

    if (!paginate) return data;

    return {
      QTime: responseHeader.QTime || 0,
      total: response ? response.numFound : grouped[groupKey].matches,
      limit: query.limit,
      skip: query.offset,
      data,
      ...additionalResponse
    }
  }

  async _create(data: Data, params?: ServiceParams): Promise<Result>
  async _create(data: Data[], params?: ServiceParams): Promise<Result[]>
  async _create(data: Data | Data[], _params?: ServiceParams): Promise<Result | Result[]>
  async _create(
    data: Data | Data[],
    params: ServiceParams = {} as ServiceParams
  ): Promise<Result | Result[]> {
  if (_.isEmpty(data)) throw new MethodNotAllowed('Data is empty');

    const sel = select(params, this.id);

    let dataToCreate: any | any[] = Array.isArray(data) ? [...data] : [{ ...data }];

    if (this.options.createUUID) {
      dataToCreate = addIds(dataToCreate, this.options.id);
    }

    await this.client.post(this.updateHandler, { data: dataToCreate, params: this.options.commit });

    return sel(Array.isArray(data) ? dataToCreate : dataToCreate[0]);
  }

  async _patch(id: null, data: PatchData, params?: ServiceParams): Promise<Result[]>
  async _patch(id: NullableId, data: PatchData, params?: ServiceParams): Promise<Result>
  async _patch(id: NullableId, data: PatchData, _params?: ServiceParams): Promise<Result | Result[]>
  async _patch(
    id: NullableId,
    _data: PatchData,
    params: ServiceParams = {} as ServiceParams
  ): Promise<Result | Result[]> {
    if (id === null && !this.allowsMulti('patch', params)) {
      throw new MethodNotAllowed('Can not patch multiple entries')
    }
    const sel = select(params, this.id);
    const response = await this._getOrFind(id, params);
    const dataToPatch = Array.isArray(response) ? response : [response];
    const patchData = dataToPatch.map((current: any) => ({
      [this.id]: current[this.id], ...Object.fromEntries(
        Object.entries(_data)
          .filter(([field]) => field !== this.id)
          .map(([field, value]) => (
            [field, _.isObject(value) ? value : value === undefined ? { set: null } : { set: value }]
          )
          )
      )
    }));

    await this.client.post(this.updateHandler, { data: patchData, params: this.options.commit });

    const ids = dataToPatch.map((d: any) => d[this.id]);
    const result = await this._find({ ...params, query: { id: { $in: ids } } });

    return sel(ids.length === 1 && Array.isArray(result) && result.length > 0 ? result[0] : result)
  }

  async _update(id: NullableId, data: Data, params: ServiceParams = {} as ServiceParams): Promise<Result> {
    if (id === null || Array.isArray(data)) {
      throw new BadRequest('You can not replace multiple instances. Did you mean \'patch\'?')
    }
    const sel = select(params, this.id);

    await this._getOrFind(id, params);

    await this.client.post(this.updateHandler, {
      data: [{ ...data, id }],
      params: this.options.commit
    });

    return this._getOrFind(id, params)
      .then(res => sel(_.omit(res, 'score', '_version_')));
  }

  async _remove(id: null, params?: ServiceParams): Promise<Result[]>
  async _remove(id: NullableId, params?: ServiceParams): Promise<Result>
  async _remove(id: NullableId, _params?: ServiceParams): Promise<Result | Result[]>
  async _remove(
    id: NullableId,
    params: ServiceParams = {} as ServiceParams
  ): Promise<Result | Result[]> {
    if (id === null && !this.allowsMulti('remove', params)) {
      throw new MethodNotAllowed('Can not remove multiple entries')
    }
    const sel = select(params, this.id);
    const dataToDelete = await this._getOrFind(id, params);
    const { query } = this.filterQuery(id, params);
    const queryToDelete = id ?
      { delete: id } :
      query.filter.length > 0 ?
        { delete: { query: query.filter.join(' AND ') } } :
        { delete: { query: '*:*' } };

    await this.client.post(this.updateHandler, { data: queryToDelete, params: this.options.commit });

    return sel(dataToDelete);
  }
}
