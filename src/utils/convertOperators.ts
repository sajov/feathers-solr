import { operatorResolver } from './operatorResolver';
import { _ } from '@feathersjs/commons/lib';
const _has = (obj: any, key: string) => {
  return key.split('.').every(function (x) {
    if (typeof obj !== 'object' || obj === null || !(x in obj)) {
      return false;
    }
    obj = obj[x];
    return true;
  });
};

export function convertOperators (query: any, escapeFn: any, root = ''): any {

  if (Array.isArray(query)) return query.map(q => convertOperators(q, escapeFn));

  const converted = Object.keys(query).reduce((res: any, prop: any) => {
    const value = query[prop];
    let queryString;

    if (prop === '$or') {
      const o = [].concat.apply([], convertOperators(value, escapeFn));
      queryString = operatorResolver.$or(o);
    } else if (_has(operatorResolver, prop)) {
      const escapedResult = escapeFn(root, value);
      queryString = operatorResolver[prop](escapedResult.key, escapedResult.value);
    } else {
      if (!_.isObject(value)) {
        const escapedResult = escapeFn(root || prop, value);
        queryString = operatorResolver.$eq(escapedResult.key, escapedResult.value);
      } else {
        queryString = convertOperators(value, escapeFn, prop);
      }
      if (Array.isArray(queryString)) {
        if (queryString.length > 1) {
          queryString = operatorResolver.$and(queryString);
        }
      }
      return res.concat(queryString);
    }

    res.push(queryString);

    return res;
  }, []);

  return converted;
}
