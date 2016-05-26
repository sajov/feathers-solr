if (!global._babelPolyfill) { require('babel-polyfill'); }

import makeDebug from 'debug';
import errors from 'feathers-errors';
import Solr from './client/Solr';

const debug = makeDebug('feathers-solr');

class Service {

  constructor(options = {}) {
    this.options = options;
    this.Solr = new Solr({
      scheme:'http',
      host:'localhost',
      port:8983,
      path:'/solr/',
      core:'gettingstarted/'
    });
  }

  find(params) {
    return new Promise((resolve, reject) => {
      // Put some async code here.
      if (!params.query) {
        return reject(new errors.BadRequest());
      }
      resolve([1,1]);
    });
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