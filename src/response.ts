interface SolrResponse {
  responseHeader: {
    QTime: number;
  }
  response: {
    numFound: number;
    start: number;
    docs?: any [];
    grouped?: any [];
  }
}

//@ts-ignore
export function responseFind (filters, query, paginate, res: Partial<SolrResponse>) {
  const { responseHeader, response } = res;
  const { numFound, start, docs, grouped, ...additionalResponse  } = response;
  const { max, default: def  } = paginate;
  const { $limit, $skip } = filters;

  if (!max && !def) {
    return docs || grouped;
  }

  return {
    QTime: responseHeader.QTime || 0,
    total: numFound || 0,
    limit: $limit ? parseInt($limit) : paginate.default || paginate.max,
    skip: $skip ? parseInt($skip) : 0,
    data: docs || grouped,
    ...additionalResponse
  };
}

export function responseGet (res: any, allDocs = false) {
  const  { response } = res;

  return allDocs === false ? response.docs[0] : response.docs;
}
