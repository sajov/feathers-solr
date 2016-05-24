if (!global._babelPolyfill) { require('babel-polyfill'); }

// import request from 'request';
var request = require('request');
import errors from 'feathers-errors';
import makeDebug from 'debug';

const debug = makeDebug('feathers-solr');

class Service {
  constructor(options = {}) {
    this.options = options;
         request('http://localhost:8983/solr/gettingstarted/select?indent=on&q=*:*&wt=json', function (error, response, body) {
          if (!error && response.statusCode === 200) {

              console.log('REQUEST',body); // Show the HTML for the Modulus homepage.
              // console.log(body); // Show the HTML for the Modulus homepage.
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
}

export default function init(options) {
  debug('Initializing feathers-solr plugin');
  return new Service(options);
}

init.Service = Service;