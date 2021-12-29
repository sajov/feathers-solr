interface ResposeHeader {
  status: number;
  QTime: number;
  params: {
    json: string;
  }
}

interface Response {
  numFound: number;
  start: number;
  docs: any [];
}

// interface Groupes {
//   groupValue: string;
//   doclist: Response;
// }

// interface ResponseGrouped {
//   matches: number;
//   groups: Groupes [];
// }

// interface ResponseGroupedSimple {
//   matches: number;
//   ngroups: number;
//   doclist: Response [];
// }

interface SolrResponse {
  responseHeader: ResposeHeader;
  response?: Response;
  // grouped?: Record<string, ResponseGrouped | ResponseGroupedSimple>;
}


// export function getDataFromResponse(response: Partial<SolrResponse>): number {
//   // if(response.response) return response.response.numFound;
//   // return response.response ? response.response.numFound : response.grouped.
// }

export function responseFind (filters: any, paginate: any, res: Partial<SolrResponse>) {
  const { responseHeader, response,  ...additionalResponse } = res;

  if (!paginate.max && !paginate.default) {
    return response.docs;
  }

  return {
    QTime: responseHeader.QTime || 0,
    total: response.numFound || 0,
    limit: filters.$limit ? parseInt(filters.$limit, 10) : paginate.default || paginate.max,
    skip: filters.$skip ? parseInt(filters.$skip, 10) : response.start,
    data: response.docs , // || grouped,
    ...additionalResponse
  };
}

export function responseGet (res: Partial<SolrResponse>) {
  const  { response } = res;
  return response.docs[0];
}
