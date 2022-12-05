export const filterResolver: any = {
  $search: (value: string | undefined) => value || '*:*',
  $select: (fields: string[]) => fields.length > 0 ? fields.join(',') :  '*,score',
  $limit: ($limit: number, paginate: any) => {

    if(typeof $limit !== 'undefined') {
      if(paginate === false) {
        return $limit
      } else if(paginate.max) {
        return paginate.max > $limit ? $limit : paginate.max;
      } else if(paginate.default) {
        return paginate.default > $limit ? $limit : paginate.default;
      }
    }

    if(paginate) {
      return paginate.max || paginate.default;
    }

    return 1000;
  },
  $skip: (value: number) => value || 0,
  $sort: (value: any) => Object.keys(value)
          .map(key => key + (parseInt(value[key], 10) === 1 ? ' asc' : ' desc'))
          .join(','),
  $params: (query: any) => query.$params ? { params: query.$params } : {},
  $facet: (query: any) => query.$facet ? { facet: query.$facet } : {},
  $filter: (query: any) => !query ? { filter: [] } : { filter: query }
};
