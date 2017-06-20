import { expect } from 'chai';
import plugin from '../src';

let Adapter = new plugin.Service({
    paginate: {
    default: 10,
    max: 4
    }
  });

describe('Adapter', () => {

  describe('Remove', () => {
    it('should return status "OK"', done => {
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

  describe('Find', () => {
    var response;
    before(function (done){
      done();
    });

    it('find ALL should return Array', done => {
      Adapter.find({})
        .then(function(res){
          response = res;
          expect(response.data).to.be.instanceof(Array);

          done();
        })
        .catch(function (err) {
          console.log('err',err);
          done();
        });
    });


    it('find ALL should return empty Array', done => {
      console.log('response',response);
      expect(response.data).to.have.lengthOf(0);
      done();
    });

  });

  describe('Create', () => {
    it('create should return status "OK"', done => {
      Adapter.create([
            {
              'id': 'adapter1',
              'name': 'Doc adapter1',
              'country': 'germany',
              'age': 23
            },
            {
              'id': 'adapter2',
              'name': 'Doc adapter2',
              'country': 'uk',
              'age': 48
            },
            {
              'id': 'adapter3',
              'name': 'Doc adapter3',
              'country': 'es',
              'age': 24
            }
            ])
      .then(function(res){
        console.log('res',res);
        expect(res).not.to.be.equal(0);
        done();
      })
      .catch(function (err) {
        console.log('err',err);
        expect(err).to.be.equal(1);
        done();
      });
    });
  });

  // describe('Find', () => {
  // var response;
  // // before(function (done){
  // //   done();
  // // });

  // it('find ALL should return Array', done => {
  //   Adapter.find({})
  //     .then(function(res){
  //       response = res;
  //       expect(response).to.be.instanceof(Array);

  //       done();
  //     })
  //     .catch(function (err) {
  //       console.log('err',err);
  //       done();
  //     });
  // });


  // it('find ALL should return empty Array lengthOf 3', done => {
  //   expect(response).to.have.lengthOf(3);
  //   done();
  // });

  // it('find by id should return Array', done => {
  //   Adapter.find({query:{id:'adapter1',age:23}})
  //     .then(function(res){
  //       response = res;
  //       expect(response).to.be.instanceof(Array);

  //       done();
  //     })
  //     .catch(function (err) {
  //       console.log('err',err);
  //       done();
  //     });
  // });


  // it('find by id should return empty Array lengthOf 1', done => {
  //   expect(response).to.have.lengthOf(1);
  //   done();
  // });


  // it('find ALL and sort by age', done => {
  //   Adapter.find({query:{$sort:{age:1}}})
  //     .then(function(res){
  //       response = res;
  //       // console.log('response',response);
  //       expect(response).to.be.instanceof(Array);

  //       done();
  //     })
  //     .catch(function (err) {
  //       console.log('err',err);
  //       done();
  //     });
  // });

  // });

  // describe('Update', () => {
  // var response;
  // it('update {id:adapter1,age:23}', done => {
  //   Adapter.update('adapter1',{name:'sajo',country:'mazedonia'})
  //     .then(function(res){
  //       response = res;
  //       // console.log('res',res);
  //       expect(response).not.to.be.instanceof(Array);

  //       done();
  //     })
  //     .catch(function (err) {
  //       console.log('err',err);
  //       done();
  //     });
  // });

  // it('find by id should return name sajo', done => {
  //   Adapter.find({query:{id:'adapter1'}})
  //     .then(function(res){
  //       // console.log('res',res[0]);
  //       //TODO handle response array|object by count 1
  //       expect(res[0].name).to.include('sajo');

  //       done();
  //     })
  //     .catch(function (err) {
  //       console.log('err',err);
  //       done();
  //     });
  // });

  // });

  // describe('Get', () => {
  // var response;
  // it('get {id:adapter1} should not be Array', done => {
  //   Adapter.get('adapter1')
  //     .then(function(res){
  //       response = res;
  //       expect(response).not.to.be.instanceof(Array);
  //       done();
  //     })
  //     .catch(function (err) {
  //       console.log('err',err);
  //       done();
  //     });
  // });

  // it('name should be sajo', done => {
  //   expect(response.name).to.include('sajo');
  //   done();
  // });

  // it('country should be mazedonia', done => {
  //   expect(response.country).to.include('mazedonia');
  //   done();
  // });

  // });

});
