import { NullableId, Query } from '@feathersjs/feathers';
import { randomUUID } from 'crypto';
import { _ } from '@feathersjs/commons';

export const addIds = (data: any[], key: string) => {
  return data.map((d: any) => {
    if(!d[key]) d[key] = randomUUID();
    return d;
  })
}

const _has = (obj: any, key: string) =>  {
  return key.split('.').every(function (x) {
    if (typeof obj !== 'object' || obj === null || !(x in obj)) {
      return false;
    }
    obj = obj[x];
    return true;
  });
};

export const whitelist = ['$search', '$suggest', '$params', '$facet', '$populate'];

export const operators: any = {
  $in: (key: string, value: any) => {
    return `${key}:(${value.join(' OR ')})`;
  },
  $or: (value: any) => {
    return `(${value.join(' OR ')})`;
  },
  $lt: (key: string, value: any) => {
    return `${key}:[* TO ${value}}`;
  },
  $lte: (key: string, value: any) => {
    return `${key}:[* TO ${value}]`;
  },
  $gt: (key: string, value: any) => {
    return `${key}:{${value} TO *]`;
  },
  $gte: (key: string, value: any) => {
    return `${key}:[${value} TO *]`;
  },
  $like: (key: string, value: any) => {
    return `${key}:*${value}*`;
  },
  $nlike: (key: string, value: any) => {
    return `!${key}:*${value}*`;
  },
  $eq: (key: string, value: any) => {
    return `${key}:${value}`;
  },
  $ne: (key: string, value: any) => {
    return `!${key}:${value}`;
  },
  $and: (value: any) => {
    return `(${value.join(' AND ')})`;
  },
  $nin (key: string, value: any) {
    return `!${key}:(${value.join(' OR ')})`;
  },
  $limit (filters: any) {
    return typeof filters.$limit === 'undefined' ?
                  {} :
                  { limit: parseInt(filters.$limit, 10) };
  },
  $skip (filters: any) {
    return filters.$skip ? { offset: filters.$skip } : {};
  },
  $sort (filters: any) {
    const result: any = {};
    if (filters.$sort) {
      const sort: any = [];
      Object.keys(filters.$sort).forEach(name => {
        sort.push(name + (parseInt(filters.$sort[name], 10) === 1 ? ' asc' : ' desc'));
      });
      result.sort = sort.join(',');
    }
    return result;
  },
  $params (query: any) {
    if (query.$params) return { params: query.$params };
    return {};
  },
  $facet (query: any) {
    if (query.$facet) return { facet: query.$facet };
    return {};
  },
  $filter (query: any) {
    if(!query) return {filter: []};
    return { filter: query };
  }
};

export function jsonQuery (id: NullableId, filters: any, query: Query, paginate: any, escapeFn: any) {
  const { $filter, ...adapterQuery} = query;
  const result = Object.assign(
    {
      query: (adapterQuery.$search || '*:*').toString(),
      fields: Array.isArray(filters.$select) ? filters.$select.join(',') + ',id' : '*,score',
      limit: paginate.max || paginate.default || 10,
      offset: 0
    },
    operators.$sort(filters),
    operators.$skip(filters),
    operators.$limit(filters),
    operators.$params(adapterQuery),
    operators.$facet(adapterQuery),
    operators.$filter($filter)
  );

  // merge id and query // TODO: Fix if query.id has operators
  if (id && _has(adapterQuery, 'id')) {
    adapterQuery.id = `(${id} AND ${adapterQuery.id})`;
  } else if (id) {
    adapterQuery.id = id;
  }

  // convert special adapter params
  whitelist.forEach(param => {
    delete adapterQuery[param];
  });

  // convert adapterQuery
  if (!_.isEmpty(adapterQuery)) {
    result.filter = [
      ...result.filter,
      ...convertOperators(adapterQuery, escapeFn)
    ]
  }

  return result;
}

function convertOperators (query:any, escapeFn: any, root = ''): any {

  if (Array.isArray(query)) return query.map(q => convertOperators(q, escapeFn));

  const converted = Object.keys(query).reduce((res: any, prop: any) => {
    const value = query[prop];
    let queryString;

    if (prop === '$or') {
      const o = [].concat.apply([], convertOperators(value, escapeFn));
      queryString = operators.$or(o);
    } else if (_has(operators, prop)) {
      const escapedResult = escapeFn(root, value);
      queryString = operators[prop](escapedResult.key, escapedResult.value);
    } else if (typeof prop === 'string') {
      if (!_.isObject(value)) {
        const escapedResult = escapeFn(root || prop, value);
        queryString = operators.$eq(escapedResult.key, escapedResult.value);
      } else {
        queryString = convertOperators(value, escapeFn, prop);
      }
      if (Array.isArray(queryString)) {
        if (queryString.length > 1) {
          queryString = operators.$and(queryString);
        }
      }
      return res.concat(queryString);
    }

    res.push(queryString);

    return res;
  }, []);

  return converted;
}

export function deleteQuery (id: any, params: any, escapeFn: any) {
  if (id) {
    return { delete: id };
  } else if (_.isObject(params) && !_.isEmpty(params)) {
    return { delete: { query: convertOperators(params, escapeFn).join(' AND ') } };
  }

  return { delete: { query: '*:*' } };
}

export function patchQuery (toPatch: any, patch: any, idField: any) {
  toPatch = Array.isArray(toPatch) ? toPatch : [toPatch];

  const ids = toPatch.map((current: any) => current[idField]);
  const atomicFieldUpdate: any = {};

  Object.keys(patch).forEach(field => {
    if (field !== idField) {
      const value = patch[field];
      if (_.isObject(value)) {
        atomicFieldUpdate[field] = value;
      } else {
        atomicFieldUpdate[field] = value === '' ? { remove: value } : { set: value };
      }
    }
  });

  const patchData = toPatch.map((current: any) => {
    return {...{[idField]: current[idField]}, ...atomicFieldUpdate}
  });

  return { ids, patchData };
}
