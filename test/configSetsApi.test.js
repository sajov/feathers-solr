import { expect } from 'chai';
import plugin from '../src';

let Adapter = new plugin.Service({
  paginate: {
    default: 10,
    max: 4
  }
});
describe('ConfigSetApi', function()  {
  this.timeout(10000);
  describe('List', function()  {
    this.timeout(10000);
    it('contains configSet `default`', function(done) {
      this.timeout(10000);
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


  describe('Create', function()  {
    this.timeout(10000);
    it('create configSet `sajov`', function(done) {
      this.timeout(10000);
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

    it('list configSet contains `sajov`', function(done) {
      this.timeout(10000);
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


  describe('Delete', function()  {
    this.timeout(10000);
    it('delete configSet `sajov`', function(done) {
      this.timeout(10000);
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

    it('not contains configSet `sajov`', function(done) {
      this.timeout(10000);
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
