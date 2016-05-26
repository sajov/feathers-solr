if (!global._babelPolyfill) { require('babel-polyfill'); }

// import request from 'request';
var request = require('request');
import errors from 'feathers-errors';
import makeDebug from 'debug';
import Solr from './client/Solr';

const debug = makeDebug('feathers-solr');

class Service {
  constructor(options = {}) {
    this.options = options;
    this.Solr = new Solr({
      host:'localhost',
      port:8983,
      path:'solr/',
      core:'gettingstarted/'
    });
         request('http://localhost:8983/solr/gettingstarted/select?indent=on&q=*:*&wt=json', function (error, response, body) {
          if (!error && response.statusCode === 200) {

              console.log('REQUEST',body); // Show the HTML for the Modulus homepage.
              // console.log(body); // Show the HTML for the Modulus homepage.
              // this.Solr.t('test solr client');
          }
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
}

export default function init(options) {
  debug('Initializing feathers-solr plugin');
  return new Service(options);
}

init.Service = Service;