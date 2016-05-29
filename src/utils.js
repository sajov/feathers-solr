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

  if(_.has(params, '$or')) {

    let $or = _.get(params, '$or');

    query.filter = [];

    Array.apply(null, Object.keys($or)).forEach(function(item,index){
      console.log('OR Array.each',item,index);
      // if(Array.isArray($or[item])) {

      // }

    });
    delete params.$or;
    console.log('query or???',params);
  }

  Array.apply(null, Object.keys(params)).forEach(function(item,index){
      console.log('DEFAULT Array.each',item,index);

      query.filter = query.filter || [];

      if(typeof params[item] === 'string') {
        query.filter.push(item + ':' + params[item]);
      }

      if(Array.isArray(params[item])) {
        query.filter.push(item + ':' + params[item]);
      }

  });

  return query;
}

/**
 * Request parser
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @return {object}        Solr query
 */
export function requestParser(params, opt) {

  console.log('requestParser ================================================================');
  console.log('params',params);

  // default $limit, $skip, $sort, and $select
  let query = {
    /* solr Json Request Api */
    limit: _.get(params, 'query.$limit') || 10,
    offset: _.get(params, 'query.$skip') || 0,
    sort: _.get(params, 'query.$sort') || '_version_ desc',
    fields: _.get(params, 'query.$select') || '*'

    /* solr default SearchHandler*/
    // start: _.get(params, 'query.$skip') || 0,
    // rows: _.get(params, 'query.$limit') || 10,
    // sort: _.get(params, 'query.$sort') || '_version_ desc',
    // fl: _.get(params, 'query.$select') || '*'
  };

  // extended $q
  if(_.has(params, 'query.$q')) {
    query.query = params.query.$q;
  }

  if(_.has(params,'query')) {
    query = queryParser(query, params.query, opt);
  }

  console.log('query', query);
  return query;

}

/**
 * Request parser
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @param  {object} opt    Solr response object
 * @return {object}        Adapter response
 */
export function responseParser(params, opt, res) {

  console.log('Utils.responseParser',res);

  let response = {
    total: res.response.numFound || 0,  //"<total number of records>",
    limit: _.get(opt, 'paginate.max') || _.get(params, 'query.$sort') || 10 ,  //"<max number of items per page>",
    skip: parseInt(params.query.$skip),  //res.response.start "<number of skipped items (offset)>",
    data: res.response.docs || []  //[/* data */]
  };

  if(_.has(res, 'facet_counts.facet_fields')) {
    response.facet = _.get(res, 'facet_counts.facet_fields');
  }

  return response;
}
