import { operatorResolver } from './operatorResolver';
import { _ } from '@feathersjs/commons/lib';

export const convertOperators = (query: any, escapeFn: any, root = ''): string[] =>
  Array.isArray(query) ?
    query.map(q => convertOperators(q, escapeFn, root)) :
    Object.keys(query).map((prop: any) =>
      prop === '$or' ?
        operatorResolver.$or(convertOperators(query[prop], escapeFn)) :
        prop === '$and' ?
          operatorResolver.$and(convertOperators(query[prop], escapeFn, prop)) :
          (prop in operatorResolver) ?
            operatorResolver[prop](...Object.values(escapeFn(root, query[prop]))) :
            _.isObject(query[prop]) ?
              operatorResolver.$and(convertOperators(query[prop], escapeFn, prop)) :
              operatorResolver.$eq(...Object.values(escapeFn(prop, query[prop]))));
