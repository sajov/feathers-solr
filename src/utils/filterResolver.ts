export const filterResolver: any = {
  $search: (value: string | undefined) => value || '*:*',
  $select: (fields: string[] | undefined) => {
    return (!Array.isArray(fields) || fields.length === 0 ?
      ['*', 'score'] : fields.indexOf('id') === -1 ?
        fields.concat(['id']) : fields).join(',')
  },
  $limit: ($limit: number, paginate: any) => Math.min(Number($limit ?? paginate.default ?? 15), paginate.max ?? $limit ?? 15 as unknown as number),
  $skip: (value: number) => value || 0,
  $sort: (value: any) => Object.keys(value).map(key => `${key} ${(parseInt(value[key], 10) === 1 ? 'asc' : 'desc')}`).join(',')
};
