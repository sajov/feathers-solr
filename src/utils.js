/**
 * Helper
 * @type {Object}
 */
export const _ = {
  values(obj) {
    return Object.keys(obj).map(key => obj[key]);
  },
  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  },
  extend(... args) {
    return Object.assign(... args);
  },
  omit(obj, ...keys) {
    const result = Object.assign({}, obj);
    for(let key of keys) {
      delete result[key];
    }
    return result;
  },
  pairs(obj) {
    return [Object.keys(obj)[0],obj[Object.keys(obj)[0]]];
  },

  pick(source, ...keys) {
    const result = {};
    for(let key of keys) {
      result[key] = source[key];
    }
    return result;
  },
  has(obj, key) {
    return key.split('.').every(function(x) {
        if(typeof obj !== 'object' || obj === null || !(x in obj)) {
            return false;
        }
        obj = obj[x];
        return true;
    });
  },
  get(obj, key) {
    return key.split('.').reduce(function(o, x) {
        return (typeof o === 'undefined' || o === null) ? o : o[x];
    }, obj);
  }
};



export function getOrder(sort={}) {
  let order = {};

  Object.keys(sort).forEach(name => {
    order[name] = sort[name] === 1 ? 'asc' : 'desc';
  });

  return order;
}

const queryMappings = {
  $lt: '<',
  $lte: '<=',
  $gt: '>',
  $gte: '>=',
  $ne: '!',
  $nin: '!'
};

const specials = ['$sort', '$limit', '$skip', '$select'];

function getValue(value, prop) {

  if(typeof value === 'object' && specials.indexOf(prop) === -1) {
    let query = {};

    Object.keys(value).forEach(key => {
      if(queryMappings[key]) {
        query[queryMappings[key]] = value[key];
      } else {
        query[key] = value[key];
      }
    });

    return query;
  }

  return value;
}

export function getWhere(query) {
  let where = {};

  if(typeof query !== 'object') {
    return {};
  }

  Object.keys(query).forEach(prop => {
    const value = query[prop];

    if(prop === '$or') {
      where.or = value;
    } else if(value.$in) {
      where[prop] = value.$in;
    } else {
      where[prop] = getValue(value, prop);
    }
  });

  return where;
}

/**
 * Internal Query parser
 * @param  {object} query  Solr base query
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @return {object}        Solr query
 */
function queryParser(query, params, opt) {

  delete params.$q;
  delete params.$sort;
  delete params.$limit;
  delete params.$skip;
  delete params.$select;
  // delete query.$populate;

  let filter = [];

  if(_.has(params, '$or')) {

    let $or = _.get(params, '$or');

    Array.apply(null, Object.keys($or)).forEach(function(item,index){
      // console.log('OR Array.each',item,index);
      // if(Array.isArray($or[item])) {

      // }
    });
    delete params.$or;
    // console.log('query or???',params);
  }

  Array.apply(null, Object.keys(params)).forEach(function(item,index){
      query.filter = query.filter || [];


      if(Array.isArray(params[item])) {
        filter.push(item + ':' + params[item]);
      } else {
        filter.push(item + ':' + params[item]);
      }

  });


  return filter;
}

function getFilter(object) {

  let pairs = _.pairs(object);
  return (pairs[0] || '*') + ':' + (pairs[1] || '*');

}

/**
 * Solr default select parser
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @return {object}        Solr query
 */
export function requestParser(params, opt) {
      // default $limit, $skip, $sort, and $select
  let query = {
    /* solr default SearchHandler*/
    start: _.get(params, 'query.$skip') || 0,
    rows: _.get(params, 'query.$limit') || 10,
    sort: _.get(params, 'query.$sort') || '_version_ desc',
    fl: _.get(params, 'query.$select') || '*'
  };

  // extended $q
  if(_.has(params, 'query.$q')) {
    query.q = params.query.$q;
  }

  if(_.has(params,'query')) {
    query.fq = queryParser(query, params.query, opt);
  }

  // console.log('query', query);
  return query;
}

/**
 * Solr Json Request Api
 * @param  {object} params Request params
 * @param  {object} opt    Adapter config
 * @return {object}        Solr query object
 */
export function requestParserJson(params, opt) {
  console.log('Utils.requestParserJson',params);

  // default $limit, $skip, $sort, and $select
  let query = {
    limit: _.get(params, 'query.$limit') || _.get(opt, 'paginate.default') || _.get(opt, 'paginate.max'),
    offset: _.get(params, 'query.$skip') || 0,
    sort: _.get(params, 'query.$sort') || '_version_ desc',
    fields: _.get(params, 'query.$select') || '*'
  };

  // extended $q
  if(_.has(params, 'query.$q')) {
    query.query = params.query.$q;
  }

  if(_.has(params,'query')) {
    query.filter = queryParser(query, params.query, opt);
  }
  // console.log('query', query);
  return query;

}

/**
 * Response parser
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @param  {object} opt    Solr response object
 * @return {object}        Adapter response
 */
export function responseParser(params, opt, res) {

  console.log('Utils.responseParser',params);

  let response = {};

  if(_.has(opt, 'paginate.max')) {
    response = {
      total: _.get(res, 'response.numFound') || 0,  //"<total number of records>",
      limit: parseInt(_.get(params, '_query.$limit')) || _.get(opt, 'paginate.default') || _.get(opt, 'paginate.max'),
      skip: parseInt(_.get(params, '_query.$skip')) || 0,  //res.response.start "<number of skipped items (offset)>",
      data: responseDocsParser(res, true)  //[/* data */]
    };
  } else {
    response = _.get(res, 'response.docs') || [];
  }

  if(_.has(res, 'facet_counts.facet_fields')) {
    response.facet = _.get(res, 'facet_counts.facet_fields');
  }

  return response;
}

/**
 * Response Docs parser
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @param  {object} opt    Solr response object
 * @return {object}        Adapter response
 */
export function responseDocsParser(res, allDocs = false) {

  let response = allDocs === false ? {} : [];

  if(!_.has(res, 'response.docs')) {
    return response;
  }

  let docs = _.get(res, 'response.docs') || [];

  return allDocs === false ? docs[0] : docs;

}

export function deleteParser(id, params) {

  if(id) {
    if(!Array.isArray(id)) {
      id = id;
    }
    return {delete: {id: id}};
  }

  if(params) {
    //TODO' implement array
    return {delete: {query: getFilter(params)}};
  }

  return {delete: {query: '*'}};
}