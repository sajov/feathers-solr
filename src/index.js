if (!global._babelPolyfill) { require('babel-polyfill'); }

import { _ , filter, responseParser } from './utils';
import errors from 'feathers-errors';
import Solr from './client/Solr';
import makeDebug from 'debug';

const debug = makeDebug('feathers-solr');

class Service {

  constructor(options = {}) {
    this.options = options;
    this.Solr = new Solr({
      scheme:'http',
      host:'localhost',
      port:8983,
      path:'/solr',
      core:'/gettingstarted',
      managedScheme: false
    });
    // console.log('this.options',this);
  }

  find(params) {
    return new Promise((resolve, reject) => {
      // Put some async code here.
      console.log('params',params);
      if (!params.query && 1===10) {
        return reject(new errors.BadRequest());
      }
      // const result = this._find(params, query => filter(query, this.paginate));
      // console.log('result',result);
      // resolve({id:1, name:'sajo', text:'test'});
       this.Solr.search({fq:'id:45412'})
        .then(function(res){
          console.log('res',res);
          return resolve(responseParser(this.options, res));

        })
        .catch(function (err) {
          console.log('err',err);
          return reject('err',err);
        });
    });
  }


  // Find without hooks and mixins that can be used internally and always returns
  // a pagination object
  _find(params, getFilter = filter) {
    const query = params.query || {};
    const filters = getFilter(query);
    console.log('_find',query, filters);
    let values = _.values(this.store).filter(query);

    const total = values.length;

    // if(filters.$sort) {
    //   values.sort(filters.$sort);
    // }

    // if(filters.$skip){
    //   values = values.slice(filters.$skip);
    // }

    // if(filters.$limit) {
    //   values = values.slice(0, filters.$limit);
    // }

    // if(filters.$select) {
    //   values = values.map(value => _.pick(value, filters.$select));
    // }

    this.solr.search({fq:'id:45412'})
        .then(function(res){
          console.log('res',res);

        })
        .catch(function (err) {
          console.log('err',err);
        });

    return Promise.resolve({
      total,
      limit: filters.$limit,
      skip: filters.$skip || 0,
      data: values
    });
  }

  // get(id) {

  // }

  create(data) {
     return this.Solr.update(data);
  }

  // update(id, data) {

  // }

  // patch(id, data, params) {

  // }

  // remove(id, data, params) {

  // }

  test(param) {
    // this.Solr.search.testMe('wow',param);
    this.Solr.req('test solr client'+param);
    return param;
  }

  init(param) {
    console.log('wow',param);
  }

  client() {
    return this.Solr;
  }
}

export default function init(options) {
  debug('Initializing feathers-solr plugin');
  return new Service(options);
}

init.Service = Service;