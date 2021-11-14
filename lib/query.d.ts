export declare const addIds: (data: any, key?: string) => any;
export declare const _has: (obj: any, key: string) => boolean;
export declare const _get: (obj: any, key: string) => any;
export declare const whitelist: string[];
export declare const Operators: any;
export declare function jsonQuery(id: any, filters: any, query: any, paginate: any, escapeFn: any): any;
export declare function deleteQuery(id: any, params: any, escapeFn: any): {
    delete: any;
};
export declare function patchQuery(toPatch: any, patch: any, idField: any): {
    ids: any;
    patchData: any;
};
export declare const getIds: (data: any, id: any) => any;
