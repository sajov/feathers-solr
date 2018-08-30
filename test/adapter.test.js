import { expect } from 'chai';
import plugin from '../src';

let Adapter = new plugin.Service({
  paginate: {
    default: 10,
    max: 4
  }
});

describe('Adapter', () => {
  describe('Status', () => {
    it('Adapter Ping', done => {
        Adapter.client().ping()
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                expect(res.status).to.be.equal('OK');
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });
  });

describe('Status', () => {
    it('should return status "OK"', done => {
      Adapter.status()
        .then(function(res) {
          // console.log('res',res);
          expect(res.responseHeader.status).to.be.equal(0);
          done();
        })
        .catch(function(err) {
          // console.log('err',err);
          done();
        });
    });
  });

  describe('Remove', () => {
    it('should return status "OK"', done => {
      Adapter.remove()
        .then(function(res) {
          // console.log('res',res);
          expect(res.responseHeader.status).to.be.equal(0);
          done();
        })
        .catch(function(err) {
          // console.log('err',err);
          done();
        });
    });
  });

  describe('Find', () => {
    var response;
    before(function(done) {
      done();
    });

    it('find ALL should return Array', done => {
      Adapter.find({})
        .then(function(res) {
          response = res;
          expect(response.data).to.be.instanceof(Array);

          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });


    it('find ALL should return empty Array', done => {
      // console.log('response',response);
      expect(response.data).to.have.lengthOf(0);
      done();
    });

  });

  describe('Create', function () {
    this.timeout(5000);
    it('create should return status "OK"', done => {
      Adapter.create([{
            'id': 'adapter1',
            'name': 'Doc adapter1',
            'country': 'germany',
            'age_i': 23
          },
          {
            'id': 'adapter2',
            'name': 'Doc adapter2',
            'country': 'uk',
            'age_i': 48
          },
          {
            'id': 'adapter3',
            'name': 'Doc adapter3',
            'country': 'es',
            'age_i': 24
          }
        ])
        .then(function(res) {
          // console.log('res',res);
          expect(res).not.to.be.equal(0);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          expect(err).to.be.equal(1);
          done();
        });
    });
  });

  describe('Find', () => {
    var response;
    // before(function (done){
    //   done();
    // });

    it('find ALL should return Array', done => {
      Adapter.find({})
        .then(function(res) {
          response = res;
          expect(response.data).to.be.instanceof(Array);

          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });


    it('find ALL should return empty Array lengthOf 3', done => {
      expect(response.data).to.have.lengthOf(3);
      done();
    });

    it('find by id should return Array', done => {
      Adapter.find({ query: { id: 'adapter1', 'age_i': 23 } })
        .then(function(res) {
          response = res;

          expect(response).to.be.instanceof(Object);
          expect(response.data).to.be.instanceof(Array);

          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('find ALL and sort by age_i', done => {
      Adapter.find({ query: { $sort: { 'age_i': 1 } } })
        .then(function(res) {
          response = res;
          // console.log('response',response);
          expect(response.data).to.be.instanceof(Array);

          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('find by $or', done => {
      Adapter.find({
          query: {
            $or: [
              { 'age_i': 23 },
              { 'id': 'adapter3' },
              { id: { '$ne': 'adapter3' } },
              { id: { '$nin': ['adapter1', 'adapter3', 'adapter2'] } },
              { 'age_i': { $in: [23, 25, 23, 48] } }
            ]
          }
        })
        .then(function(res) {
          response = res;
          expect(response.data).to.be.instanceof(Array);

          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });


  });

  describe('Update', () => {
    var response;
    it('update {id:adapter1,age_i:23}', done => {
      Adapter.update('adapter1', { name: 'sajo', country: 'mazedonia', 'test_s': 'dude' })
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          expect(response.country).to.be.equal('mazedonia');

          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('get by id should return Object', done => {
      Adapter.get(response.id)
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          expect(response.test_s).to.be.equal('dude');

          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });


    it('find ALL should return Array', done => {
      Adapter.find({})
        .then(function(res) {
          response = res;
          expect(response.data).to.be.instanceof(Array);

          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('find by id should return name sajo', done => {
      Adapter.find({ query: { id: 'adapter1' } })
        .then(function(res) {
          //TODO handle response array|object by count 1
          expect(res.data[0].name).to.include('sajo');

          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

  });

  describe('Patch', function() {
    this.timeout(10000);
    var response;
    it('patch simple {id:adapter1,patch_s:patched}', done => {
      Adapter.patch('adapter1', { 'patch_s': 'patched' })
        .then(function(res) {
          response = res[0];
          expect(response).to.be.instanceof(Object);
          expect(response.patch_s).to.deep.equal({ set: 'patched' });
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('get patched response should include patched', done => {
      Adapter.get('adapter1')
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          expect(response.patch_s).to.be.equal('patched');
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('delete multivalued by regex {id:adapter1,patch_ss:{"removeregex":".*"}}', done => {
      Adapter.patch('adapter1', { 'patch_ss': {'removeregex':'.*'} })
        .then(function(res) {
          response = res[0];
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('patch simple multivalued {id:adapter1,patch_ss:[patched1,patched2]}', done => {
      Adapter.patch('adapter1', { 'patch_ss': ['patched1', 'patched2'] })
        .then(function(res) {
          response = res[0];
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('patched response should include patched1, patched2', done => {
       Adapter.get('adapter1')
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          expect(response.patch_ss).to.be.an('array').that.includes('patched1');
          expect(response.patch_ss).to.be.an('array').that.includes('patched2');
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });

    });

    it('patch multivalued using `add` {id:adapter1,patch_ss:[patched3]}', done => {
      Adapter.patch('adapter1', { 'patch_ss': {add:['patched3','patched4', 'patched5']} })
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });



    it('patched response should include patched1, patched2, patched3, patched4, patched5', done => {
       Adapter.get('adapter1')
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          expect(response.patch_ss).to.be.an('array').that.includes('patched1');
          expect(response.patch_ss).to.be.an('array').that.includes('patched2');
          expect(response.patch_ss).to.be.an('array').that.includes('patched3');
          expect(response.patch_ss).to.be.an('array').that.includes('patched4');
          expect(response.patch_ss).to.be.an('array').that.includes('patched5');
          expect(response.patch_ss).to.have.lengthOf(5);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });

    });


    it('patch using `set`', done => {
      Adapter.patch('adapter1', { 'patch_i': {set:1}, 'patch_is': {set:1}, patch_regegex_ss: {set:['test1','test2','fine']} })
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('patch using `add`', done => {
      Adapter.patch('adapter1', { 'patch_is': {add:[2,3,4,5,6]} })
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('patch using `remove`', done => {
        Adapter.patch('adapter1', { 'patch_is': {remove:6} })
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('patch using `removeregex`', done => {
        Adapter.patch('adapter1', { 'patch_regegex_ss': {'removeregex':'test.*'} })
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('patch using `inc`', done => {
      Adapter.patch('adapter1', { 'patch_i': {inc:99} })
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('patch using `inc` to decrement', done => {
      Adapter.patch('adapter1', { 'patch_i': {inc:-1} })
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('patched response should include patched1, patched2, patched3, patched4, patched5', done => {
       Adapter.get('adapter1')
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          expect(response.patch_is).to.be.an('array').to.be.deep.equal([1,2,3,4,5]);
          expect(response.patch_ss).to.be.an('array').to.be.deep.equal(['patched1','patched2','patched3','patched4','patched5']);
          expect(response.patch_regegex_ss).to.be.an('array').to.be.deep.equal(['fine']);
          expect(response.patch_i).to.be.equal(99);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });

    });


   it('patch multiple by query', done => {
      Adapter.patch(null, { 'patch_i': {set:1}, 'patch_is': {set:1}, patch_regegex_ss: {set:['test1','test2','fine']} }, {query:{id:'adapter1'}})
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

     it('patched multiple response', done => {
       Adapter.get('adapter1')
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          // expect(response.patch_is).to.be.an('array').to.be.deep.equal([1]);
          expect(response.patch_regegex_ss).to.be.an('array').to.be.deep.equal(['test1','test2','fine']);
          expect(response.patch_i).to.be.equal(1);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });

    });

    it('patch all by query', done => {
      Adapter.patch(null, { 'patch_all_i': {set:1},'patch_all_is': {set:2}, patch_all_regegex_ss: {set:['fine']} }, {query:{id:'*',$limit:1000}})
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

     it('patched all response', done => {
       Adapter.find({})
        .then(function(res) {
          response = res;
          expect(response).to.be.instanceof(Object);
          expect(response.data[0].patch_all_i).to.be.equal(1);
          expect(response.data[1].patch_all_i).to.be.equal(1);
          expect(response.data[2].patch_all_i).to.be.equal(1);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });

    });

  });

  describe('Get', () => {
    var response;
    it('get {id:adapter1} should not be Array', done => {
      Adapter.get('adapter1')
        .then(function(res) {
          response = res;
          expect(response).not.to.be.instanceof(Array);
          done();
        })
        .catch(function(err) {
          console.log('err', err);
          done();
        });
    });

    it('name should be sajo', done => {
      expect(response.name).to.include('sajo');
      done();
    });

    it('country should be mazedonia', done => {
      expect(response.country).to.include('mazedonia');
      done();
    });

  });

});
