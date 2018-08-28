import { expect } from 'chai';
import plugin from '../src';

let Adapter = new plugin.Service({
  paginate: {
    default: 10,
    max: 4
  }
});
describe('CollectionsApi', () => {

  describe('List', () => {
    it('contains collections `gettingstarted`', done => {
      Adapter.client().collections().list()
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                expect(res.collections).to.be.an('array').that.does.include('gettingstarted');
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });
  });

  describe('Create', function() {
    this.timeout(10000);
    it('create collections `sajov`', done => {
      Adapter.client()
            .collections()
            .create({
              name:'sajov',
              numShards:2,
              replicationFactor:1
            })
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });

    it('contains collections `sajov`', done => {
      Adapter.client().collections().list()
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                expect(res.collections).to.be.an('array').that.does.include('sajov');
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });
  });

  describe('Delete', function() {
    this.timeout(10000);
    it('delete collections `sajov`', done => {
      Adapter.client()
            .collections()
            .delete({name:'sajov'})
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });

    it('not contains collections `sajov`', done => {
      Adapter.client().collections().list()
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                expect(res.collections).to.be.an('array').that.does.not.include('sajov');
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });

  });

});
