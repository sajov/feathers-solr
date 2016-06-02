import { expect } from 'chai';
import plugin from '../src';
var request = require('request-promise');
let Adapter = new plugin.Service();
let Client = Adapter.client();
let CoreAdmin = Client.coreAdmin();
let response;

describe('Core Admin Api', () => {

  describe('Core Status', () => {

    it('core status should be 0', done => {
      CoreAdmin
      .status()
        .then(function(res){
          response = res;
          // console.log(res);
          expect(res.responseHeader.status).to.be.equal(0);
          // expect(res.status).to.be.equal('OK');
          done();
        })
        .catch(function (err) {
            console.log('err',err);
            done();
        });
    });


    it('core name should be gettingstarted', done => {
        expect(response.status.gettingstarted.name).be.equal('gettingstarted');
        done();
    });

  });

  // describe('Core Create', () => {

  //   it('core status should be 0', done => {
  //     CoreAdmin
  //       .create({
  //                 name: 'coreX',
  //                 loadOnStartup: true,
  //                 instanceDir: 'coreX',
  //                 configSet: 'gettingstarted',
  //                 config: 'solrconfig.xml',
  //                 schema: 'schema.xml',
  //                 // config: '../gettingstarted/config/solrconfig.xml',
  //                 // schema: '../gettingstarted/config/schema.xml',
  //                 dataDir: 'data'
  //             })
  //         .then(function(res){
  //           response = res;
  //           console.log(res);
  //           expect(res.responseHeader.status).to.be.equal(0);
  //           // expect(res.status).to.be.equal('OK');
  //           done();
  //         })
  //         .catch(function (err) {
  //             console.log('err',err);
  //             done();
  //         });
  //   });
  // });

  // describe('Core Status', () => {
  // });

});
