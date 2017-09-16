'use strict';

import * as _ from './tools';

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

    parseQuery (query) {

        Object.keys(query).forEach(function (item, index) {
            if (item[0] === '$') {
                if(typeof Query[item] !== 'undefined') {
                    Query[item](item, query[item]);
                }
                delete query[index];
            } else {
                Query.filter(item, query[item]);
            }
        });


    },

    filter (field, param) {
        if (_.isObject(param)) {
            Object.keys(param).forEach(function(f) {
                if (f[0] === '$' && typeof Query[f] !== 'undefined') {
                    Query[f](field, param[f]);
                }
            });

        } else if (Array.isArray(param)) {
            if (Array.isArray(param)) {
                param = '(' + param.join(' OR ') + ')';
            }
            this.query.filter.push(field + ':' + param);
        } else {
            this.query.filter.push(field + ':' + param);
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
            order.push(name + (parseInt(param[name]) === 1 ? ' asc' : ' desc'));
        });

        this.query.sort = order.join(' ');
    },

    $select (field, param) {
        this.query.fields = param;
    },

    $in (field, param) {
        this.query.filter.push(field + ':("' + param.join('" OR "') + '")');
    },

    $nin (field, param) {
        this.query.filter.push('!' + field + ':("' + param.join('" OR "') + '")');
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
        this.query.filter.push('!' + field + ':"' + param + '"');
    },

    $or (field, param) {
        let filter = this.query.filter;
        this.query.filter = [];
        Object.keys(param).forEach(function(item, index) {

          if (item[0] === '$' && typeof Query[item] !== 'undefined') {
            Query[item](item,param[item]);
          } else {
            Query.filter(item,param[item]);
          }

        });

        filter.push('(' + this.query.filter.join(' OR ') + ')');
        this.query.filter = filter;
    },

    $qf (field, params) {
        this.query.params = Object.assign({}, this.query.params || {}, {qf: params});
    },

    $facet (field, params) {
        this.query.facet = Object.assign(this.query.facet || {},params);
    },

    $params (field, params) {
        this.query.params = Object.assign(this.query.params || {},params);
    }

};


export function queryJson(params, opt) {

    Query.init(opt);

    if (_.has(params, 'query')) {
        Query.parseQuery(params.query);
    }
    return Query.query;

}

export function querySuggest(params, opt) {

    let query = {q: params.query.$suggest};

    if(_.has(params.query, '$params')) {
        query.params = params.query.$params;
    }

    return query;
}

export function queryDelete(id, params) {

  if (id !== null) {

    return { delete: { id: id } };

  } else if(_.isObject(params)) {

    let crit = [];

    Object.keys(params).forEach(function(name){
        crit.push(name+':'+params[name]);
    })
      return { delete: { query: crit.join(',') } };
  }

  return { delete: { query: '*' } };
}