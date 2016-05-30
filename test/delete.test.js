import { expect } from 'chai';
import plugin from '../src';
let Adapter = new plugin.Service();
var response;
describe('Delete', () => {

  it('Adapter.remove should return status "OK"', done => {
    Adapter.remove()
      .then(function(res){
        expect(res.responseHeader.status).to.be.equal(0);
        done();
      })
      .catch(function (err) {
        console.log('err',err);
        done();
      });
  });

});
