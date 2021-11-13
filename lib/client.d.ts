export interface SolrClient {
    get: (resource: string, params?: any) => Promise<any>;
    post: (resource: string, params?: any, data?: any) => Promise<any>;
}
export interface SolrClientOptions {
    host: string;
    core: string;
}
export declare const solrClient: (options: SolrClientOptions) => SolrClient;
