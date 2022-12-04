export const filterResolver: any = {
  $limit: (filters: any) => typeof filters.$limit === 'undefined' ?
    {} :  { limit: parseInt(filters.$limit, 10) },
  $skip: (filters: any) => filters.$skip ? { offset: filters.$skip } : {},
  $sort: (filters: any) => {
    const result: any = {};
    if (filters.$sort) {
      const sort: any = [];
      Object.keys(filters.$sort).forEach(name => {
        sort.push(name + (parseInt(filters.$sort[name], 10) === 1 ? ' asc' : ' desc'));
      });
      result.sort = sort.join(',');
    }
    return result;
  },
  $params: (query: any) => query.$params ? { params: query.$params } : {},
  $facet: (query: any) => query.$facet ? { facet: query.$facet } : {},
  $filter: (query: any) => !query ? { filter: [] } : { filter: query }
};
