import { operatorResolver } from './operatorResolver';
import { _ } from '@feathersjs/commons/lib';

export function convertOperators(query: any, escapeFn: any, root = ''): any {
  return Array.isArray(query) ?
    query.map(q => convertOperators(q, escapeFn)) :
    Object.keys(query).map(prop =>  prop === '$or' ?
          operatorResolver.$or(convertOperators(query[prop], escapeFn)) :
          typeof operatorResolver[prop] !== 'undefined' ?
            operatorResolver[prop](...Object.values(escapeFn(root, query[prop]))) :
            _.isObject(query[prop]) ?
              operatorResolver.$and(convertOperators(query[prop], escapeFn, prop)) :
              operatorResolver.$eq(...Object.values(escapeFn(prop, query[prop]))));
}
