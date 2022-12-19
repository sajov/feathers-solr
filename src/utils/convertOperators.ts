import { operatorResolver } from './operatorResolver';
import { _ } from '@feathersjs/commons/lib';

export function convertOperators(query: any, escapeFn: any, root = ''): any {
  if (Array.isArray(query)) return query.map(q => convertOperators(q, escapeFn));

  return Object.keys(query).map((prop: any) =>
    prop === '$or' ?
      operatorResolver.$or(convertOperators(query[prop], escapeFn)) :
      typeof operatorResolver[prop] !== 'undefined' ?
        operatorResolver[prop](...Object.values(escapeFn(root, query[prop]))) :
        _.isObject(query[prop]) ?
          operatorResolver.$and(convertOperators(query[prop], escapeFn, prop)) :
          operatorResolver.$eq(...Object.values(escapeFn(prop, query[prop]))));
}
