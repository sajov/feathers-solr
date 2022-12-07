import { operatorResolver } from './operatorResolver';
import { _ } from '@feathersjs/commons/lib';

export function convertOperators(query: any, escapeFn: any, root = ''): any {
  if (Array.isArray(query)) return query.map(q => convertOperators(q, escapeFn));

  const converted = Object.keys(query).reduce((res: any, prop: any) => {
    const value = query[prop];
    let queryString;

    if (prop === '$or') {
      queryString = operatorResolver.$or(convertOperators(value, escapeFn));
    } else if (typeof operatorResolver[prop] !== 'undefined') {
      queryString = operatorResolver[prop](...Object.values(escapeFn(root, value)));
    } else if (_.isObject(value)) {
      queryString = convertOperators(value, escapeFn, prop);
    } else {
      queryString = operatorResolver.$eq(...Object.values(escapeFn(prop, value)));
    }

    if (Array.isArray(queryString) && queryString.length > 1) {
      queryString = operatorResolver.$and(queryString);
    }

    return res.concat(queryString);
  }, []);

  return converted;
}
