import { expect } from 'chai';
import plugin from '../src';

describe('feathers-solr', () => {
  it('is CommonJS compatible', () => {
    expect(typeof require('../lib')).to.equal('function');
  });

  it('basic functionality', done => {
    expect(typeof plugin).to.equal('function', 'It worked');
    done();
  });

  it('exposes the Service class', done => {
    expect(plugin.Service).to.not.equal(undefined);
    done();
  });

  it('method test', done => {
    console.log(plugin);
    let Adapter = new plugin.Service();
    expect(Adapter.test('dude')).to.be.equal('dude');
    done();
  });

  it('method test', done => {
    console.log(plugin);
    let Adapter = new plugin.Service();
    Adapter.ping()
    .then(function(resp){
      expect(resp.responseHeader.status).to.be.equal(0);
      expect(resp.response.start).to.be.equal(0);
    })

    done();
  });
});
