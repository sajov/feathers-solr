'use strict';

import * as _ from './tools';
import newQuery from './newQuery';

function getSort(sort = {}) {
  let order = [];

  Object.keys(sort).forEach(name => {
    order.push(name + (sort[name] === '1' ? ' asc' : ' desc'));
  });

  return order.join(' ');
}

/**
 * Internal Query parser
 * @param  {object} query  Solr base query
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @return {object}        Solr query
 */
function queryParser(query, params, opt) {

  if (_.has(params, '$or')) {

    let $or = _.get(params, '$or');

    Array.apply(null, Object.keys($or)).forEach(function(item, index) {
        // console.log('OR Array.each',item,index);
        // if(Array.isArray($or[item])) {

        // }
    });
    delete params.$or;
    // console.log('query or???',params);
  }

  // pluck object.keys.foreach $pf=text $ps=100...
  // # simple boosts by popularity
  //  defType=lucene&df=text&q=%2Bsupervillians+_val_:"popularity"
  //  defType=dismax&qf=text&q=supervillians&bf=popularity
  //  q={!boost b=popularity}text:supervillians
  //
  //  # boosts based on complex functions of the popularity field
  //  defType=lucene&q=%2Bsupervillians+_val_:"sqrt(popularity)"
  //  defType=dismax&qf=text&q=supervillians&bf=sqrt(popularity)
  //  q={!boost b=sqrt(popularity)}text:supervillians
  if (_.has(params, '$qf')) {
  // TODO: use config.qf otherwise copy field _text_ is used
    query.params = Object.assign({}, query.params || {}, {qf: params.$qf});
    delete params.$qf;
  }

  if(_.has(params, '$facet')) {
    Array.apply(null, Object.keys(params)).forEach(function(item, index) {
        query.filter = query.filter || [];

        if (Array.isArray(params[item])) {
            query.filter.push(item + ':' + params[item]);
        } else {
            query.filter.push(item + ':' + params[item]);
        }

    });
    delete params.$facet;
  }

  Array.apply(null, Object.keys(params)).forEach(function(item, index) {
    query.filter = query.filter || [];

    if (Array.isArray(params[item])) {
        query.filter.push(item + ':' + params[item]);
    } else {
        query.filter.push(item + ':' + params[item]);
    }

  });


  return query;
}

export const Query = {

    query: {},

    init (opt) {

        this.opt = opt;
        this.query = {
            query: '*:*',// TODO:  score
            filter: [],
            sort:'',
            fields:_.get(opt, 'query.$select') || '*,score', // TODO:  score
            limit: _.get(opt, 'paginate.default') || _.get(opt, 'paginate.max') || 10,
            offset: 0,
        };

    },

    filter (field, param) {

        if(typeof param === 'string') {

            this.query.filter.push(field + ':' + param);

        } else if(Array.isArray(param)) {

            if(Array.isArray(param)) {
                param = '(' + param.join(' OR ') + ')'
            }
            this.query.filter.push(field + ':' + param);

        } else {

            Object.keys(param).forEach(function(f) {
                if(f[0] === '$' && typeof Query[f] !== 'undefined') {
                    Query[f](field, param[f]);
                }
            });
        }
    },

    $search (field, param) {
        this.query.query = param;
    },

    $limit (field, param) {
        this.query.limit = param;
    },

    $skip (field, param) {
       this.query.offset = param;
    },

    $sort (field, param) {

        let order = [];

        Object.keys(param).forEach(name => {
            order.push(name + (param[name] === '1' ? ' asc' : ' desc'));
        });

        this.query.sort = order.join(' ');
    },

    $select (field, param) {
        this.query.fields = param;
    },

    $in (field, param) {
        this.query.filter.push(field + ':(' + param.join(' OR ') + ')');
    },

    $nin (field, param) {
        this.query.filter.push('!' + field + ':(' + param.join(' OR ') + ')');
    },

    $lt (field, param) {
        this.query.filter.push(field + ':[* TO ' + param + '}');
    },

    $lte (field, param) {
        this.query.filter.push(field + ':[* TO ' + param + ']');
    },

    $gt (field, param) {
        this.query.filter.push(field + ':{' + param + ' TO *]');
    },

    $gte (field, param) {
        this.query.filter.push(field + ':[' + param + ' TO *]');
    },

    $ne (field, param) {
        this.query.filter.push('!' + field + ':' + param);
    },

    $or (field, param) {

        let filter = this.query.filter;
        this.query.filter = [];

        Object.keys(param).forEach(function(item, index) {

          if(item[0] === '$' && typeof Query[item] !== 'undefined') {
            Query[item](item,param[item]);
          } else {
            Query.filter(item,param[item]);
          }

        });
        filter.push('(' + this.query.filter.join(' OR ') + ')')
        this.query.filter = filter;
        console.log('??????',this.query.filter);
    },

    $qf (field, params) {
        this.query.params = Object.assign({}, this.query.params || {}, {qf: params});
    },

    $facet (field, params) {
        this.query.facet = this.query.facet || {};
        this.query.facet[field] = params;
    }

};

/**
 * Solr Json Request Api
 * @param  {object} params Request params
 * @param  {object} opt    Adapter config
 * @return {object}        Solr query object
 */
export function queryJson(params, opt) {

    // let Q = new newQuery(opt);
    console.log('queryparams',params);
    Query.init(opt);
    if (_.has(params, 'query')) {
        Object.keys(params.query).forEach(function(item, index) {
          if(item[0] === '$' && typeof Query[item] !== 'undefined') {
            Query[item](item,params.query[item]);
          } else {
            Query.filter(item,params.query[item]);
          }
        });
    }
    console.log('queryNEW',Query.query);
    return Query.query;

  // let query = {
  //   query: _.get(params, 'query.$search') || '*:*', // TODO:  score
  //   limit: _.get(params, 'query.$limit') || _.get(opt, 'paginate.default') || _.get(opt, 'paginate.max'),
  //   offset: _.get(params, 'query.$skip') || 0,
  //   fields: _.get(params, 'query.$select') || '*,score', // TODO:  score
  //   sort: getSort(_.get(params, 'query.$sort') || {})
  // };


  // if (_.has(params, 'query')) {
  //   params = _.omit(params.query,'$sort','$search','$limit','$skip','$select','$facet');
  //   query = queryParser(query, params, opt);
  // }

  // return query;
}

/**
 * Solr default select parser
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @return {object}        Solr query
 */
export function query(params, opt) {
  // default $limit, $skip, $sort, and $select
  let query = {
      /* solr default SearchHandler*/
      start: _.get(params, 'query.$skip') || 0,
      rows: _.get(params, 'query.$limit') || 10,
      sort: _.get(params, 'query.$sort') || '_version_ desc',
      fl: _.get(params, 'query.$select') || '*'
  };

  // extended $q
  if (_.has(params, 'query.$q')) {
      query.q = params.query.$q;
  }

  if (_.has(params, 'query.$search')) {
      query.q = params.query.$search;
  }

  if (_.has(params, 'query')) {
      query.fq = queryParser(query, params.query, opt);
  }

  // console.log('query', query);
  return query;
}

export function queryDelete(id, params) {

  if (id) {
    if (!Array.isArray(id)) {
        id = id;
    }
    return { delete: { id: id } };
  }

  if (params) {
    //TODO' implement array
    let pairs = _.pairs(params.query);
    return { delete: { query: (pairs[0] || '*') + ':' + (pairs[1] || '*') } };
  }

  return { delete: { query: '*' } };
}