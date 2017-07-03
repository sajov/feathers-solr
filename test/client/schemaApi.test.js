import { expect } from 'chai';
import plugin from '../../src';
var request = require('request-promise');
let Adapter = new plugin.Service();
let Client = Adapter.client();
let SchemaApi = Client.schema();
// let Config = Client.config();
let response;

describe('Schema Api', () => {

    describe('Get', () => {

        it('name example-data-driven-schema', done => {
            SchemaApi
                .name()
                .then(res => {
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(res).to.not.have.property('errorMessages');
                    expect(res.name).to.be.equal('example-data-driven-schema');
                    done();
                })
                .catch(err => {
                    console.log('err', err);
                    done();
                });
        });

        it('version 1.6', done => {
            SchemaApi
                .version()
                .then(res => {
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(res).to.not.have.property('errorMessages');
                    expect(res).to.have.property('version');
                    expect(res.version).to.be.equal(1.6);
                    done();
                })
                .catch(err => {
                    console.log('err', err);
                    done();
                });
        });


        it('uniquekey id', done => {
            SchemaApi
                .uniquekey()
                .then(res => {
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(res).to.not.have.property('errorMessages');
                    expect(res.uniqueKey).to.be.equal('id');
                    done();
                })
                .catch(err => {
                    console.log('err', err);
                    done();
                });
        });

        it('similarity org.apache.solr.search.similarities.SchemaSimilarityFactory', done => {
            SchemaApi
                .similarity()
                .then(res => {
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(res).to.not.have.property('errorMessages');
                    expect(res.similarity.class).to.be.equal('org.apache.solr.search.similarities.SchemaSimilarityFactory');
                    done();
                })
                .catch(err => {
                    console.log('err', err);
                    done();
                });
        });

    });

    describe('Fields', () => {

        it('get', done => {
            SchemaApi
                .fields()
                .then(res => {
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(res).to.not.have.property('errorMessages');
                    done();
                })
                .catch(err => {
                    console.log('err', err);
                    done();
                });
        });

    });

    // describe('FieldTypes', () => {

    // }

    // describe('dynamicFields', () => {

    // }

});
