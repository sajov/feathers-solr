
import type { AdapterParams, AdapterQuery, AdapterServiceOptions } from '@feathersjs/adapter-commons';

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
  requestOptions?: { timeout: 10 };
  escapeFn?: (key: string, value: any) => { key: string, value: any };
}

export interface SolrAdapterParams<Q = AdapterQuery> extends AdapterParams<Q, Partial<SolrAdapterOptions>> {}
