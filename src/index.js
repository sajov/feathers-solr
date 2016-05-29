if (!global._babelPolyfill) { require('babel-polyfill'); }

import { _ , filter, requestParserJson, requestParser, responseParser } from './utils';
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
      managedScheme: false,
      /*commitStrategy softCommit: true, commit: true, commitWithin: 50*/
      commitStrategy: {
            softCommit: true,
            commitWithin: 50000,
            overwrite: true
          }
    });

  }

  find(params) {

    let _self = this;

    return new Promise((resolve, reject) => {
      console.time('test');
      this.Solr.json(requestParserJson(params))
        .then(function(res){
          console.timeEnd('test');
          resolve(responseParser(params, _self.options, res));
        })
        .catch(function (err) {
          console.log('err',err);
          return reject(new errors.BadRequest());
        });

    });

  }

  // get(id) {

  // }

  create(data) {

    return this.Solr.update(data);

  }

  update(id, data) {

  }

  patch(id, data, params) {

  }

  remove(id, data, params) {

  }

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