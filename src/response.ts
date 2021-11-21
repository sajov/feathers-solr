// import { _ } from '@feathersjs/commons';

/**
 * Response parser
 */

// @ts-ignore
export function responseFind (filters, query, paginate, res) {
  const  { responseHeader, response } = res;
  const  { numFound, start, docs, grouped, ...additionalResponse  } = response;
  const  { max, default: def  } = paginate;
  const {$limit, $skip} = filters;
  console.log(filters,'filters???')
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

/**
 * Response Docs parser
 */
// @ts-ignore
export function responseGet (res, allDocs = false) {
  const  { response } = res;
  //@ts-ignore
  // if (!_.has(res, 'response.docs') && !_.has(res, 'grouped')) {
  //   return allDocs === false ? {} : [];
  // }

  // const docs = _.get(res, 'response.docs') || _.get(res, 'grouped') || [];

  return allDocs === false ? response.docs[0] : response.docs;
}
