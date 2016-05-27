import { expect } from 'chai';
import plugin from '../src';
let Adapter = new plugin.Service();

describe('Select', () => {

  it('basic functionality', done => {
    expect(typeof plugin).to.equal('function', 'It worked');
    done();
  });

  it('exposes the Service class', done => {
    expect(plugin.Service).to.not.equal(undefined);
    done();
  });

  it('Adapter instance is object', done => {
    expect(typeof Adapter).to.be.equal('object');
    done();
  });

  it('Adapter Client instance', done => {
    expect(typeof Adapter.client()).to.be.equal('object');
    done();
  });


  it('Adapter Ping', done => {
    Adapter.client().ping()
      .then(function(res){
        expect(res.responseHeader.status).to.be.equal(0);
        expect(res.status).to.be.equal('OK');
        done();
      })
      .catch(function (err) {
          expect(err).to.be.equal('OK');
          done();
      });
  });
});
