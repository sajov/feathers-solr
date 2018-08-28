import { expect } from 'chai';
import plugin from '../src';

let Adapter = new plugin.Service({
  paginate: {
    default: 10,
    max: 4
  }
});
describe('ConfigSetApi', () => {

  describe('List', () => {
    it('contains configSet `default`', done => {
      Adapter.client().configSets().list()
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                expect(res.configSets).to.be.an('array').that.does.include('_default');
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });
  });


  describe('Create', () => {
    it('create configSet `sajov`', done => {
      Adapter.client()
            .configSets()
            .create({name:'sajov'})
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });

    it('list configSet contains `sajov`', done => {
      Adapter.client().configSets().list()
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                expect(res.configSets).to.be.an('array').that.does.include('sajov');
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });
  });


  describe('Delete', () => {
    it('delete configSet `sajov`', done => {
      Adapter.client()
            .configSets()
            .delete({name:'sajov'})
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });

    it('not contains configSet `sajov`', done => {
      Adapter.client().configSets().list()
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                expect(res.configSets).to.be.an('array').that.does.not.include('sajov');
                done();
            })
            .catch(function(err) {
                done(err);
            });
    });
  });

});
