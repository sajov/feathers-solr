import { operatorResolver } from './operatorResolver';
import { _ } from '@feathersjs/commons/lib';

export type EscapeFn = (key: string, value: any) => { key: string; value: any };

export const convertOperators = (
  query: any,
  escapeFn: EscapeFn,
  root = ''
): any => {
  if (Array.isArray(query)) {
    return query.map(q => convertOperators(q, escapeFn, root));
  }

  return Object.keys(query).map((prop) => {
    if (prop === '$or') {
      return operatorResolver.$or(convertOperators(query[prop], escapeFn));
    }

    if (prop === '$and') {
      return operatorResolver.$and(convertOperators(query[prop], escapeFn, prop));
    }

    if (prop in operatorResolver) {
      const values = Object.values(escapeFn(root, query[prop]));
      return (operatorResolver[prop] as (...args: any[]) => string)(...values);
    }

    if (_.isObject(query[prop])) {
      return operatorResolver.$and(convertOperators(query[prop], escapeFn, prop));
    }

    const values = Object.values(escapeFn(prop, query[prop]));
    return (operatorResolver.$eq as (...args: any[]) => string)(...values);
  });
};
