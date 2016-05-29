import { expect } from 'chai';
import plugin from '../src';
let Adapter = new plugin.Service();
var response;
describe('Update', () => {

  it('update should return status "OK"', done => {
    Adapter.client().update([
                  {
                    'id': '45412',
                    'title': 'Doc 45412'
                  },
                  {
                    'id': '222',
                    'title': 'Doc 222'
                  }
                ])
      .then(function(res){
        expect(res.responseHeader.status).to.be.equal(0);
        done();
      })
      .catch(function (err) {
        console.log('err',err);
        done();
      });
  });

  it('Adapter.create should return status "OK"', done => {
    Adapter.create([
                  {
                    'id': '1199',
                    'title': 'Doc 1199'
                  },
                  {
                    'id': '11222',
                    'title': 'Doc 11222'
                  }
                ])
      .then(function(res){
        expect(res.responseHeader.status).to.be.equal(0);
        done();
      })
      .catch(function (err) {
        console.log('err',err);
        done();
      });
  });

  describe('test update', () => {

    it('select return status "OK"', done => {
      Adapter.client().search({fq:'id:45412'})
        .then(function(res){
          response = res;
          // console.log('res',res.response.docs);
          expect(res.responseHeader.status).to.be.equal(0);
          done();
        })
        .catch(function (err) {
          console.log('err',err);
          done();
        });
    });


    it('return status should "OK"', done => {
          expect(response.responseHeader.status).to.be.equal(0);
          done();
    });

    it('numFound should be "1"', done => {
          expect(response.response.numFound).to.be.equal(1);
          done();
    });

    it('title should be "Doc 45412"', done => {
          expect(response.response.docs[0].title[0]).to.be.equal('Doc 45412');
          done();
    });
  });

});
