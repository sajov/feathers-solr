// TypeScript Version: 3.0
import { Params, Paginated, Id, NullableId } from '@feathersjs/feathers';
import { AdapterService, ServiceOptions, InternalServiceMethods } from '@feathersjs/adapter-commons';

export interface solrService {
  [key: number]: any;
}

export interface SolrServiceOptions extends ServiceOptions {
  store: solrService;
  startId: number;
  matcher?: (query: any) => any;
  sorter?: (sort: any) => any;
}

export class Service<T = any> extends AdapterService<T> implements InternalServiceMethods<T> {
  options: SolrServiceOptions;
  store: solrService;

  constructor(config?: Partial<SolrServiceOptions>);

  _find(params?: Params): Promise<T | T[] | Paginated<T>>;
  _get(id: Id, params?: Params): Promise<T>;
  _create(data: Partial<T> | Array<Partial<T>>, params?: Params): Promise<T | T[]>;
  _update(id: NullableId, data: T, params?: Params): Promise<T>;
  _patch(id: NullableId, data: Partial<T>, params?: Params): Promise<T>;
  _remove(id: NullableId, params?: Params): Promise<T>;
}

declare const init: ((config?: Partial<SolrServiceOptions>) => Service);
export default init;
