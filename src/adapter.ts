import { NotFound, MethodNotAllowed } from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import type {
  PaginationOptions
} from '@feathersjs/adapter-commons';
import {
  AdapterBase,
  filterQuery,
  select
} from '@feathersjs/adapter-commons'
import { httpClient } from './httpClient';
import { responseFind, responseGet } from './responseHandler';
import { addIds, patchQuery, deleteQuery } from './queryHandler';
import type { NullableId, Id, Paginated } from '@feathersjs/feathers'
import type { SolrAdapterOptions, SolrAdapterParams, SolrQuery } from './declarations';
import type { HttpClient } from './httpClient';
import { filterResolver } from './utils/filterResolver';
import { convertOperators } from './utils/convertOperators';

export const escapeFn = (key: string, value: any) => {
  return { key, value }
}

export class SolrAdapter<
  T,
  D = Partial<T>,
  P extends SolrAdapterParams = SolrAdapterParams<any>
> extends AdapterBase<
  T,
  D,
  P,
  SolrAdapterOptions
> {
  client: HttpClient;
  queryHandler: string;
  updateHandler: string;

  constructor(options: Partial<SolrAdapterOptions>) {
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
      escapeFn
    }, opts));

    this.queryHandler = `/${core}${this.options.queryHandler}`;
    this.updateHandler = `/${core}${this.options.updateHandler}`;
    this.client = httpClient(host, requestOptions)
  }

  filterQuery(id: NullableId | Id, params: P) {
    const { paginate } = this.getOptions(params);
    const {
      $search,
      $params,
      $select = [],
      $filter = [],
      $facet,
      ...adapterQuery
    } = params.query || {};
    const {
      $skip = 0,
      $sort,
      $limit,
      ...filter
    } = adapterQuery;

    let query: SolrQuery = {
      query: filterResolver.$search($search),
      fields: filterResolver.$select($select),
      limit: filterResolver.$limit($limit, paginate),
      offset: filterResolver.$skip($skip),
      filter: $filter
    }

    if(id) {
      query.filter = [
        ...convertOperators({[this.options.id]:id},this.options.escapeFn)
      ]
    }

    if(!_.isEmpty(filter)) {
      query.filter = [
        ...query.filter,
        ...convertOperators(filter, this.options.escapeFn)
      ]
    }

    if($sort) {
      query.sort = filterResolver.$sort($sort)
    }

    if($params) {
      query.params = $params;
    }

    if($facet) {
      query.facet = $facet;
    }

    return query;
  }

  async $getOrFind(id: NullableId | NullableId, params: P) {
    if (id !== null) return this.$get(id, params);

    // TODO: handle paginate
    return this.$find(
      Object.assign(params, { paginate: false })
    );
  }

  async $get(id: Id | NullableId, params: P = {} as P): Promise<T> {
    const query = this.filterQuery(id, params);

    const response = await this.client.post(this.queryHandler, { data: query })

    if (response.response.numFound === 0) throw new NotFound(`No record found for id '${id}'`);

    const result = responseGet(response);

    return result;
  }

  async $find(params?: P & { paginate?: PaginationOptions }): Promise<Paginated<T>>
  async $find(params?: P & { paginate: false }): Promise<T[]>
  async $find(params?: P): Promise<Paginated<T> | T[]>
  async $find(params: P = {} as P): Promise<Paginated<T> | T[]> {
    const { paginate } = this.getOptions(params);
    const {$search, $params, $filter, $facet, ...paramsQuery} = params.query;
    const { filters } = filterQuery(paramsQuery, this.options);

    const query = this.filterQuery(null, params);

    const response = await this.client.post(this.queryHandler, { data: query })

    const result = responseFind(filters, paginate, response);

    return result;
  }

  async $create(data: D, params?: P): Promise<T>
  async $create(data: D[], params?: P): Promise<T[]>
  async $create(data: D | D[], _params?: P): Promise<T | T[]>
  async $create(data: D | D[], params: P = {} as P): Promise<T | T[]> {
    const sel = select(params, this.id);

    if (_.isEmpty(data)) throw new MethodNotAllowed('Data is empty');

    let dataToCreate: any | any[] = Array.isArray(data) ? [...data] : [{ ...data }];

    if (this.options.createUUID) {
      dataToCreate = addIds(dataToCreate, this.options.id);
    }

    await this.client.post(this.updateHandler, { data: dataToCreate, params: this.options.commit });

    // return this.$getOrFind(null, params)
    //   .then(res => sel(res));
    return sel(Array.isArray(data) ? dataToCreate : dataToCreate[0]);
  }

  async $patch(id: null, data: Partial<D>, params?: P): Promise<T[]>
  async $patch(id: Id, data: Partial<D>, params?: P): Promise<T>
  async $patch(id: NullableId, data: Partial<D>, _params?: P): Promise<T | T[]>
  async $patch(id: NullableId, data: Partial<D>, params: P = {} as P): Promise<T | T[]> {
    // @ts-ignore
    const { paginate } = this.getOptions(params);

    const sel = select(params, this.id);

    const dataToPatch = await this.$getOrFind(id, params);

    const { ids, patchData } = patchQuery(dataToPatch, data, this.id);

    await this.client.post(this.updateHandler, { data: patchData, params: this.options.commit });
    //@ts-ignore
    const result = await this.$find({ query:{id: { $in: ids }}  });

    if (result.data) return sel(ids.length === 1 ? result.data[0] : result.data)

    return sel(ids.length === 1 ? result[0] : result)
  }

  async $update(id: Id | NullableId, data: D, params: P = {} as P): Promise<T> {
    const sel = select(params, this.id);

    await this.$getOrFind(id, params);

    const dataToUpdate: any = id && !Array.isArray(data) ? [{ id, ...data }] : data;

    await this.client.post(this.updateHandler, {
      data: dataToUpdate,
      params: this.options.commit
    });

    return this.$getOrFind(id, params)
      .then(res => sel(_.omit(res, 'score', '_version_')));
  }

  async $remove(id: null, params?: P): Promise<T[]>
  async $remove(id: Id, params?: P): Promise<T>
  async $remove(id: NullableId, params?: P): Promise<T | T[]>
  async $remove(id: NullableId, params: P = {} as P): Promise<T | T[]> {
    const sel = select(params, this.id);

    const dataToDelete = await this.$getOrFind(id, params);

    const { query } = filterQuery(params.query, this.options);

    const queryToDelete = deleteQuery(id, query, this.options.escapeFn);

    await this.client.post(this.updateHandler, { data: queryToDelete, params: this.options.commit });

    return sel(dataToDelete);
  }
}
