import { NullableId, Id } from '@feathersjs/feathers';
import { AdapterService, ServiceOptions, InternalServiceMethods, AdapterParams } from '@feathersjs/adapter-commons';
import { SolrClient } from './client';
export declare const escapeFn: (key: string, value: any) => {
    key: string;
    value: any;
};
export interface SolrServiceOptions<T = any> extends ServiceOptions {
    host: string;
    core: string;
    commit?: {
        softCommit?: boolean;
        commitWithin?: number;
        overwrite?: boolean;
    };
    suggestHandler?: string;
    defaultSearch?: any;
    defaultParams?: any;
    createUUID?: boolean;
    escapeFn?: (key: string, value: any) => {
        key: string;
        value: any;
    };
}
export declare class Service<T = any, D = Partial<T>> extends AdapterService<T, D> implements InternalServiceMethods<T> {
    options: SolrServiceOptions;
    client: SolrClient;
    queryHandler: string;
    updateHandler: string;
    constructor(options?: Partial<SolrServiceOptions<T>>);
    _getOrFind(id: Id, params?: AdapterParams): Promise<any>;
    _find(params?: AdapterParams): Promise<any>;
    _get(id: Id, params?: AdapterParams): Promise<any>;
    _create(data: Partial<T> | Partial<T>[], params?: AdapterParams): Promise<T | T[]>;
    _update(id: NullableId, data: T, params?: AdapterParams): Promise<any>;
    _patch(id: NullableId, data: Partial<T>, params?: AdapterParams): Promise<any>;
    _remove(id: NullableId, params?: AdapterParams): Promise<T | T[]>;
}
export default function service(options?: Partial<SolrServiceOptions>): Service<any, Partial<any>>;
