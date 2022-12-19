import { NotFound, MethodNotAllowed } from '@feathersjs/errors'
import { _ } from '@feathersjs/commons'
import { AdapterBase, select } from '@feathersjs/adapter-commons'
import { httpClient } from './httpClient';
import { addIds } from './utils/addIds';
import { filterResolver } from './utils/filterResolver';
import { convertOperators } from './utils/convertOperators';
import type { PaginationOptions } from '@feathersjs/adapter-commons';
import type { NullableId, Id, Paginated } from '@feathersjs/feathers'
import type { SolrAdapterOptions, SolrAdapterParams } from './declarations';
import type { HttpClient } from './httpClient';

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
      escapeFn: (key: string, value: any) => ({ key, value })
    }, opts));

    this.queryHandler = `/${core}${this.options.queryHandler}`;
    this.updateHandler = `/${core}${this.options.updateHandler}`;
    this.client = httpClient(host, requestOptions)
  }

  filterQuery(id: NullableId | Id, params: P) {
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

  async $getOrFind(id: NullableId | NullableId, params: P) {
    if (id !== null) return this.$get(id, params);

    return this.$find(
      Object.assign(params, { paginate: false })
    );
  }

  async $get(id: Id | NullableId, params: P = {} as P): Promise<T> {
    const { query } = this.filterQuery(id, params);
    const { response } = await this.client.post(this.queryHandler, { data: query })

    if (response.numFound === 0) throw new NotFound(`No record found for id '${id}'`);

    return response.docs[0];
  }

  async $find(params?: P & { paginate?: PaginationOptions }): Promise<Paginated<T>>
  async $find(params?: P & { paginate: false }): Promise<T[]>
  async $find(params?: P): Promise<Paginated<T> | T[]>
  async $find(params: P = {} as P): Promise<Paginated<T> | T[]> {
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

    return sel(Array.isArray(data) ? dataToCreate : dataToCreate[0]);
  }

  async $patch(id: null, data: Partial<D>, params?: P): Promise<T[]>
  async $patch(id: Id, data: Partial<D>, params?: P): Promise<T>
  async $patch(id: NullableId, data: Partial<D>, _params?: P): Promise<T | T[]>
  async $patch(id: NullableId, data: Partial<D>, params: P = {} as P): Promise<T | T[]> {
    const sel = select(params, this.id);
    const response = await this.$getOrFind(id, params);
    const dataToPatch = Array.isArray(response) ? response : [response];
    const patchData = dataToPatch.map((current: any) => {
      return {
        [this.id]: current[this.id], ...Object.fromEntries(
          Object.entries(data)
            .filter(([field]) => field !== this.id)
            .map(([field, value]) => (
              [field, _.isObject(value) ? value : value === '' ? { remove: value } : { set: value }]
            )
            )
        )
      }
    });

    await this.client.post(this.updateHandler, { data: patchData, params: this.options.commit });

    const ids = dataToPatch.map((d: any) => d[this.id]);
    const result = await this.$find({ ...params, query: { id: { $in: ids } } });

    return sel(ids.length === 1 && Array.isArray(result) && result.length > 0 ? result[0] : result)
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
