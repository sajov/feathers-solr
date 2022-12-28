export const filterResolver: any = {
  $search: (value: string | undefined) => value || '*:*',
  $select: (fields: string[] | undefined) => {
    return (!Array.isArray(fields) || fields.length === 0 ?
      ['*', 'score'] : fields.indexOf('id') === -1 ?
        fields.concat(['id']) : fields).join(',')
  },
  $limit: ($limit: number, paginate: any) => {
    return typeof $limit === 'number' ?
      paginate === false ?
        $limit :
        paginate.max ?
          paginate.max >= $limit ?
            $limit :
            paginate.max :
          paginate.default || paginate.max :
      paginate ? paginate.default || paginate.max : 15;
  },
  $skip: (value: number) => value || 0,
  $sort: (value: any) => Object.keys(value).map(key => `${key} ${(parseInt(value[key], 10) === 1 ? 'asc' : 'desc')}`).join(',')
};
