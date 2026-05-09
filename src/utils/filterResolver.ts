export interface PaginateLike {
  default?: number;
  max?: number;
}

export interface FilterResolver {
  $search: (value: string | undefined) => string;
  $select: (fields: string[] | undefined) => string;
  $limit: ($limit: number | undefined, paginate: PaginateLike | false | undefined) => number;
  $skip: (value: number | undefined) => number;
  $sort: (value: Record<string, number | string>) => string;
}

export const filterResolver: FilterResolver = {
  $search: (value) => value || '*:*',
  $select: (fields) => {
    return (!Array.isArray(fields) || fields.length === 0 ?
      ['*', 'score'] : fields.indexOf('id') === -1 ?
        fields.concat(['id']) : fields).join(',')
  },
  $limit: ($limit, paginate) => {
    const p: PaginateLike = paginate || {};
    return Math.min(Number($limit ?? p.default ?? 15), p.max ?? $limit ?? 15);
  },
  $skip: (value) => value || 0,
  $sort: (value) => Object.keys(value).map(key => `${key} ${(parseInt(String(value[key]), 10) === 1 ? 'asc' : 'desc')}`).join(',')
};
