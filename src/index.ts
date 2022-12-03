import type { AdapterParams, PaginationOptions } from '@feathersjs/adapter-commons';
import type { Paginated, ServiceMethods, Id, NullableId } from '@feathersjs/feathers';
// import type { SolrAdapterOptions } from './declarations';
import { SolrAdapter } from './adapter'

export * from './adapter'

export class SolrService<T = any, D = Partial<T>, P extends AdapterParams = AdapterParams>
  extends SolrAdapter<T, D, P>
  implements ServiceMethods<T | Paginated<T>, D, P>
{
  async find(params?: P & { paginate?: PaginationOptions }): Promise<Paginated<T>>
  async find(params?: P & { paginate: false }): Promise<T[]>
  async find(params?: P): Promise<Paginated<T> | T[]>
  async find (params?: P): Promise<Paginated<T> | T[]> {
    return this._find(params) as any
  }

  async get(id: NullableId, params?: P): Promise<T>
  async get(id: Id, params?: P): Promise<T>
  async get(id: Id | NullableId, params?: P): Promise<T> {
    return this._get(id as Id, params)
  }

  async create(data: D, params?: P): Promise<T>
  async create(data: D[], params?: P): Promise<T[]>
  async create(data: D | D[], params?: P): Promise<T | T[]> {
    return this._create(data, params)
  }

  async update(id: Id, data: D, params?: P): Promise<T>
  async update(id: NullableId, data: D, params?: P): Promise<T>
  async update(id: Id | NullableId, data: D, params?: P): Promise<T> {
    return this._update(id as Id, data, params)
  }

  async patch(id: NullableId, data: Partial<D>, params?: P): Promise<T>
  async patch(id: Id, data: Partial<D>, params?: P): Promise<T>
  async patch(id: null, data: Partial<D>, params?: P): Promise<T[]>
  async patch(id: NullableId | NullableId, data: Partial<D>, params?: P): Promise<T | T[]> {
    return this._patch(id as NullableId, data, params)
  }

  async remove(id: Id, params?: P): Promise<T>
  async remove(id: NullableId, params?: P): Promise<T>
  async remove(id: null, params?: P): Promise<T[]>
  async remove(id: NullableId | NullableId, params?: P): Promise<T | T[]> {
    return this._remove(id as NullableId, params)
  }
}
