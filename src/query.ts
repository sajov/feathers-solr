//@ts-ignore
import { randomUUID } from 'crypto';
import { _ } from '@feathersjs/commons';

export const addIds = (data: any, key = 'id') => {
  return data.map((d: any) => {
    if(!d[key]) d[key] = randomUUID();
    return d;
  })
}

export const  _has = (obj: any, key: string) =>  {
  return key.split('.').every(function (x) {
    if (typeof obj !== 'object' || obj === null || !(x in obj)) {
      return false;
    }
    obj = obj[x];
    return true;
  });
};
export const _get = (obj: any, key: string) => {
  return key.split('.').reduce(function (o, x) {
    return typeof o === 'undefined' || o === null ? o : o[x];
  }, obj);
};

export const whitelist = ['$search', '$suggest', '$params', '$facet', '$populate'];

export const Operators: any = {
  $in: (key: string, value: any) => {
    return Array.isArray(value) ? `${key}:(${value.join(' OR ')})` : `${key}:${value}`;
  },
  $or: (key: string, value: any) => {
    return Array.isArray(value) ? `(${value.join(' OR ')})` : `${key}:${value}`;
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
    return `${key}:{${value}`;
  },
  $notlike: (key: string, value: any) => {
    return `!${key}:{${value}`;
  },
  $eq: (key: string, value: any) => {
    return Array.isArray(value) ? `(${value.join(' AND ')})` : `${key}:${value}`;
  },
  $ne: (key: string, value: any) => {
    return `!${key}:${value}`;
  },
  $and: (value: any) => {
    console.log(value,'value???')
    return `(${value.join(' AND ')})`;
  },
  $nin (key: string, value: any) {
    return Array.isArray(value) ? `!${key}:(${value.join(' OR ')})` : `!${key}:${value}`;
  },
  $limit (filters: any) {
    let result: any = {};
    if (typeof filters.$limit !== 'undefined') {
      result.limit = parseInt(filters.$limit);
    }
    console.log(result,'HEHEHEHEHEHEHEHE')
    return result;
  },
  // eslint-disable-next-line no-unused-vars
  $skip (filters: any) {
    return filters.$skip ? { offset: filters.$skip } : {};
  },
  // eslint-disable-next-line no-unused-vars
  $sort (filters: any) {
    let result: any = {};
    if (filters.$sort) {
      let sort: any = [];
      Object.keys(filters.$sort).forEach(name => {
        sort.push(name + (parseInt(filters.$sort[name]) === 1 ? ' asc' : ' desc'));
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
    if (query.$filter) return { filter: Array.isArray(query.$filter) ? query.$filter : [query.$filter] };
    return {};
  }
};

export function jsonQuery (id: any, filters: any, query: any, paginate: any, escapeFn: any) {
  console.log('jsonQuery => ',id, filters, query, paginate,
  '!!')
  const adapterQuery = Object.assign({}, query);
  const result = Object.assign(
    {
      query: (adapterQuery.$search || '*:*').toString(),
      fields: Array.isArray(filters.$select) ? filters.$select.join(',') + ',id' : '*,score',
      limit: paginate.max || paginate.default || 10,
      offset: 0
    },
    Operators.$sort(filters),
    Operators.$skip(filters),
    Operators.$limit(filters),
    Operators.$params(adapterQuery),
    Operators.$facet(adapterQuery),
    Operators.$filter(adapterQuery)
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
    result.filter = convertOperators(adapterQuery, escapeFn);
  }

  return result;
}

function convertOperators (query:any, escapeFn: any, root: string = ''): any {

  if (Array.isArray(query)) {
    return query.map(q => {
      return convertOperators(q, escapeFn);
    });
  }

  if (!_.isObject(query)) {
    return query;
  }

  const converted = Object.keys(query).reduce((res: any, prop: any) => {
    const value = query[prop];
    let queryString;

    if (prop === '$or') {
      const o = [].concat.apply([], convertOperators(value, escapeFn));
      queryString = Operators.$or(root || prop, o);
    } else if (_has(Operators, prop)) {
      const escapedResult = escapeFn(root || prop, value);
      queryString = Operators[prop](escapedResult.key, escapedResult.value);
    } else if (typeof prop === 'string') {
      if (!_.isObject(value)) {
        const escapedResult = escapeFn(root || prop, value);
        queryString = Operators.$eq(escapedResult.key, escapedResult.value);
      } else {
        queryString = convertOperators(value, escapeFn, prop);
      }
      if (Array.isArray(queryString)) {
        if (queryString.length > 1) {
          queryString = Operators.$and(queryString);
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
    if (id === '*' || id === '*:*') {
      return { delete: { query: '*:*' } };
    }
    return { delete: id };
  } else if (_.isObject(params) && !_.isEmpty(params)) {
    return { delete: { query: convertOperators(params, escapeFn).join(' AND ') } };
  } else if (!id && _.isEmpty(params)) {
    return { delete: { query: '*:*' } };
  }

  return { delete: { query: '*:*' } };
}

export function patchQuery (toPatch: any, patch: any, idField: any) {
  toPatch = Array.isArray(toPatch) ? toPatch : [toPatch];

  const ids = toPatch.map((current: any) => current[idField]);
  const atomicFieldUpdate: any = {};
  const actions = ['set', 'add', 'remove', 'removeregex', 'inc'];

  Object.keys(patch).forEach(field => {
    if (field !== idField) {
      const value = patch[field];
      if (_.isObject(value)) {
        if (actions.indexOf(Object.keys(value)[0]) === -1) {
          atomicFieldUpdate[field] = { add: value };
        }
      } else if (Array.isArray(value)) {
        atomicFieldUpdate[field] = { add: value };
      } else {
        atomicFieldUpdate[field] = value === '' ? { remove: value } : { set: value };
      }
    }
  });
  const patchData = toPatch.map((current:any) => {
    return Object.assign({ [idField]: current[idField] }, atomicFieldUpdate);
  });

  return { ids, patchData };
}

export const getIds = (data:any, id: any) => {
  if (!Array.isArray(data) && data[id]) return [data[id]];

  return data.map((d: any) => {
    return d[id];
  });
};
