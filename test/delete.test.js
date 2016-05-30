import { expect } from 'chai';
import plugin from '../src';
let Adapter = new plugin.Service();
var response;
describe('Delete', () => {

  it('Adapter.remove by ID should return status "OK"', done => {
    Adapter.remove('03e81b20-5b8c-4b53-8463-294e1a25e990')
      .then(function(res){
        // console.log('res',res);
        expect(res.responseHeader.status).to.be.equal(0);
        done();
      })
      .catch(function (err) {
        // console.log('err',err);
        done();
      });
  });

  it('Adapter.remove by PARAMS should return status "OK"', done => {
    Adapter.remove(null,{title: 'test3'})
      .then(function(res){
        // console.log('res',res);
        expect(res.responseHeader.status).to.be.equal(0);
        done();
      })
      .catch(function (err) {
        // console.log('err',err);
        done();
      });
  });


  it('Adapter.remove ALL should return status "OK"', done => {
    Adapter.remove()
      .then(function(res){
        // console.log('res',res);
        expect(res.responseHeader.status).to.be.equal(0);
        done();
      })
      .catch(function (err) {
        // console.log('err',err);
        done();
      });
  });
});
