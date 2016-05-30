import plugin from '../src';
let Adapter = new plugin.Service();
// var req = require('hyperquest');
// var hyperquest = require('./promisified-hyperquest.js');


describe('request module comparison', () => {

  //   it('Adapter hyperquest test', done => {
  //   console.time('    hyperquest ping');

  //   req.get('http://localhost:8983/solr/gettingstarted/admin/ping?wt=json',
  //               {},
  //               function(){
  //                   console.timeEnd('    hyperquest ping');
  //                   done();
  //               }
  //             );
  // });

  // it('Adapter hyperquest promese', done => {
  //   console.time('    hyperquest promises ping');
  //   hyperquest.get('http://localhost:8983/solr/gettingstarted/admin/ping?wt=json')
  //     .then(function(){
  //       console.timeEnd('    hyperquest promises ping');
  //       done();
  //     })
  //     .catch(function () {
  //         done();
  //     });
  // });

  it('Adapter request', done => {
    console.time('    request ping');
    Adapter.client().ping()
      .then(function(res){
        // console.log(res);
        console.timeEnd('    request ping');
        done();
      })
      .catch(function () {
          done();
      });
  });



});
