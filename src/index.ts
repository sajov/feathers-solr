import type { PaginationOptions } from '@feathersjs/adapter-commons';
import type { Paginated, Params, Id, NullableId } from '@feathersjs/feathers';
import { SolrAdapter, SolrAdapterParams } from './adapter'

export class SolrService<
  Result = any,
  Data = Partial<Result>,
  ServiceParams extends Params<any> = SolrAdapterParams,
  PatchData = Partial<Data>
> extends SolrAdapter<Result, Data, ServiceParams, PatchData> {

  async find(params?: ServiceParams & { paginate?: PaginationOptions }): Promise<Paginated<Result>>
  async find(params?: ServiceParams & { paginate: false }): Promise<Result[]>
  async find(params?: ServiceParams): Promise<Paginated<Result> | Result[]>
  async find(params?: ServiceParams): Promise<Paginated<Result> | Result[]> {
    return this._find(params) as any
  }

  async get(id: NullableId, params?: ServiceParams): Promise<Result> {
    return this._get(id as Id, params)
  }

  async create(data: Data, params?: ServiceParams): Promise<Result>
  async create(data: Data[], params?: ServiceParams): Promise<Result[]>
  async create(data: Data | Data[], params?: ServiceParams): Promise<Result | Result[]> {
    return this._create(data, params)
  }

  async update(id: NullableId, data: Data, params?: ServiceParams): Promise<Result> {
    return this._update(id as Id, data, params)
  }

  async patch(id: null, data: PatchData, params?: ServiceParams): Promise<Result[]>
  async patch(id: NullableId, data: PatchData, params?: ServiceParams): Promise<Result>
  async patch(id: NullableId, data: PatchData, params?: ServiceParams): Promise<Result | Result[]> {
    return this._patch(id, data, params)
  }

  async remove(id: NullableId, params?: ServiceParams): Promise<Result>
  async remove(id: null, params?: ServiceParams): Promise<Result[]>
  async remove(id: NullableId, params?: ServiceParams): Promise<Result | Result[]> {
    return this._remove(id, params)
  }
}
