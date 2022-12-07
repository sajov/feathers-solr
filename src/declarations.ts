
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
