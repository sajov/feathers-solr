import * as _ from './tools';

export default class Query {

    constructor(opt) {

        this.opt = opt;
        this.query = {
            query: '*:*',// TODO:  score
            filter: [],
            sort:'',
            fields:_.get(opt, 'query.$select') || '*,score', // TODO:  score
            limit: _.get(opt, 'paginate.default') || _.get(opt, 'paginate.max') || 10,
            offset: 0,
        };
    }

    filter (field, param) {

        if(typeof param === 'string') {

            this.query.filter.push(field + ':' + param);

        } else {

            Object.keys(param).forEach(function(f) {

                if(f[0] === '$' && typeof Query[f] !== 'undefined') {
                    Query[f](field, param[f]);
                }

            });
        }
    }

    $search (field, param) {

        this.query.query = param;

    }

    $limit (field, param) {

        this.query.limit = param;

    }

    $skip (field, param) {

       this.query.offset = param;

    }

    $sort (field, param) {

        let order = [];

        Object.keys(param).forEach(name => {
            order.push(name + (param[name] === '1' ? ' asc' : ' desc'));
        });

        this.query.sort = order.join(' ');
    }

    $select (field, param) {

        this.query.fields = param;

    }

    $in (field, param) {

        this.query.filter.push(field + ':(' + param.join(' OR ') + ')');

    }

    $nin (field, param) {

        this.query.filter.push('!' + field + ':(' + param.join(' OR ') + ')');

    }

    $lt (field, param) {

        this.query.filter.push(field + ':[* TO ' + param + '}');

    }

    $lte (field, param) {

        this.query.filter.push(field + ':[* TO ' + param + ']');

    }

    $gt (field, param) {

        this.query.filter.push(field + ':{' + param + ' TO *]');

    }

    $gte (field, param) {

        this.query.filter.push(field + ':[' + param + ' TO *]');

    }

    $ne (field, param) {

        this.query.filter.push('!' + field + ':' + param);

    }

    $or (field, param) {

        Object.keys(param).forEach(function(item, index) {

          if(item[0] === '$' && typeof Query[item] !== 'undefined') {

            Query[item](item,param[item]);

          } else {

            Query.filter(item,param[item]);

          }
        });
    }

    $qf (field, params) {

        this.query.params = Object.assign({}, this.query.params || {}, {qf: params});

    }

    $facet (field, params) {

        this.query.facet = this.query.facet || {};
        this.query.facet[field] = params;

    }

}