import { Params, Paginated, Id, NullableId } from '@feathersjs/feathers';
import { AdapterService, ServiceOptions, InternalServiceMethods } from '@feathersjs/adapter-commons';
import fetch from 'node-fetch';
declare function undici(url: any, opts: object): any;

export class FetchClient { }
export class UndiciClient { }

export interface solrService {
  [key: number]: any;
}

export declare function SolrClient(fn: typeof undici, host: string, opts: object): UndiciClient;
export declare function SolrClient(fn: typeof fetch, host: string): FetchClient;
export interface SolrServiceOptions extends ServiceOptions {
  store: solrService;
  startId: number;
  matcher?: (query: any) => any;
  sorter?: (sort: any) => any;
  Model: FetchClient | UndiciClient;
  escapeFn: (field: string, value: any) => any
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
