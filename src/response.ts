interface ResposeHeader {
  status: number;
  QTime: number;
  params?: {
    json: string;
  }
}

interface Response {
  numFound: number;
  start: number;
  docs: any[];
}

interface Groupes {
  groupValue: string;
  doclist: Response;
}

interface ResponseGrouped {
  matches: number;
  ngroups?: number;
  doclist?: Response;
  groups?: Groupes[];
}

interface SolrResponse {
  responseHeader: ResposeHeader;
  response?: Response;
  grouped?: Record<string, ResponseGrouped>;
}

// interface PaginatedResult {
//   QTime: number;
//   total: number;
//   limit: number;
//   skip: number;
//   data: any [];
// }

export function responseFind(filters: any, paginate: any, res: Partial<SolrResponse>) {
  const { responseHeader, response, grouped, ...additionalResponse } = res;

  if (!paginate.max && !paginate.default) {
    return response.docs;
  }

  const groupKey: string = grouped ? Object.keys(grouped)[0] : undefined;

  return {
    QTime: responseHeader.QTime || 0,
    total: response ? response.numFound : grouped[groupKey].matches,
    limit: filters.$limit ? parseInt(filters.$limit, 10) : paginate.default || paginate.max,
    skip: filters.$skip ? parseInt(filters.$skip, 10) : response ? response.start : 0,
    data: response ? response.docs : grouped[groupKey].groups || grouped[groupKey].doclist.docs,
    ...additionalResponse
  }

}

export function responseGet(res: Partial<SolrResponse>) {
  const { response } = res;
  return response.docs[0];
}
