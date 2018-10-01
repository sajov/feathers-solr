import { expect } from 'chai';
import plugin from '../src';
let request = require('request-promise');
let Adapter = new plugin.Service({
      schema: [{
            name: 'autocomplete',
            type: 'text_auto',
            indexed: true,
            stored: true,
        }],
      migrate: 'alter',
      adminKey: false,
      idfield: 'id',
      managedScheme: true,
      /*commitStrategy softCommit: true, commit: true, commitWithin: 50*/
      commitStrategy: {
        softCommit: true,
        commitWithin: 50000,
        overwrite: true
      }
    });
let Client = Adapter.client();
let SchemaApi = Client.schema();
// let Config = Client.config();
let response;

describe('Schema Api', () => {

  describe('get', () => {

    it('name default-config', done => {
      SchemaApi
        .name()
        .then(res => {
          expect(res.responseHeader.status).to.be.equal(0);
          expect(res).to.not.have.property('errorMessages');
          expect(res.name).to.be.equal('default-config');
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

  describe('fields', () => {

    it('get', done => {
      SchemaApi
        .fields()
        .then(res => {
          expect(res.responseHeader.status).to.be.equal(0);
          expect(res).to.not.have.property('errorMessages');
          expect(res).to.have.property('fields');
          done();
        })
        .catch(err => {
          console.log('err', err);
          done();
        });
    });
  });

  describe('dynamicFields', () => {
    it('has property dynamicFields', done => {
      SchemaApi
        .dynamicfields()
        .then(res => {
          expect(res.responseHeader.status).to.be.equal(0);
          expect(res).to.not.have.property('errorMessages');
          expect(res).to.have.property('dynamicFields');
          done();
        })
        .catch(err => {
          console.log('err', err);
          done();
        });
    });
  });

  describe('fieldTypes', () => {
    it('has property fieldTypes', done => {
      SchemaApi
        .fieldtypes()
        .then(res => {
          expect(res.responseHeader.status).to.be.equal(0);
          expect(res).to.not.have.property('errorMessages');
          expect(res).to.have.property('fieldTypes');
          done();
        })
        .catch(err => {
          console.log('err', err);
          done();
        });
    });
  });

  describe('copyFields', () => {
    it('has property copyFields', done => {
      SchemaApi
        .copyfields()
        .then(res => {
          expect(res.responseHeader.status).to.be.equal(0);
          expect(res).to.not.have.property('errorMessages');
          expect(res).to.have.property('copyFields');
          done();
        })
        .catch(err => {
          console.log('err', err);
          done();
        });
    });
  });

  // describe('defaultOperator', () => {
  //   it('has property defaultOperator', done => {
  //     SchemaApi
  //       .solrqueryparser()
  //       .then(res => {
  //         expect(res.responseHeader.status).to.be.equal(0);
  //         expect(res).to.not.have.property('errorMessages');
  //         expect(res).to.have.property('defaultOperator');
  //         done();
  //       })
  //       .catch(err => {
  //         console.log('err', err);
  //         done();
  //       });
  //   });
  // });

  describe('Full Solr Schema', () => {
    var SolrSchema = {};
    it('get SolrSchema', done => {

      Promise.all([SchemaApi.get()]).then(res => {
          // responses.map(response => write(response))
          expect(res[0]).to.have.property('schema');
          expect(res[0].responseHeader.status).to.be.equal(0);
          expect(res[0]).to.not.have.property('errorMessages');
          SolrSchema = res[0].schema;
          done();
        })
        .catch(err => {
          console.log('err', err);
          done();
        });

    });

    it('has property name', () => {
      expect(SolrSchema).to.have.property('name');
    });

    it('has property version', () => {
      expect(SolrSchema).to.have.property('version');
    });

    it('has property uniqueKey', () => {
      expect(SolrSchema).to.have.property('uniqueKey');
    });

    it('has property fieldTypes', () => {
      expect(SolrSchema).to.have.property('fieldTypes');
    });

    it('has property fields', () => {
      expect(SolrSchema).to.have.property('fields');
    });

    it('has property dynamicFields', () => {
      expect(SolrSchema).to.have.property('dynamicFields');
    });

    it('has property copyFields', () => {
      expect(SolrSchema).to.have.property('copyFields');
    });
  });

  describe('deleteField `test_to_delete_field`', function() {

      it('describe to update Adapter Options',  function(done) {
        this.timeout(10000);
          Adapter.describe()
              .then(function(res) {
                  expect(res.responseHeader.status).to.be.equal(0);
                  // expect(Adapter.options.solrSchema.schema.fields).to.not.include({ name: 'test_to_delete_field',
                  //   type: 'string',
                  //   multiValued: false,
                  //   indexed: true,
                  //   stored: true });
                  done();
              })
              .catch(function(err) {
                  console.log('err', err);
                  done(err);
              });
      });

      it('has not Adapter.options.solrSchema.fields test_to_delete_field',  function() {
        expect(Adapter.options.solrSchema.schema.fields).to.not.include({ name: 'test_to_delete_field'});
      });

  });

  describe('addField `test_to_delete_field`', function() {

    it('should return Status: OK',  function(done) {
      this.timeout(10000);
        Adapter.client().schema().addField({name:'test_to_delete_field', type:'string'})
        .then(function(res) {
            expect(res.responseHeader.status).to.be.equal(0);
            done();
        })
        .catch(function(err) {
            console.log('err', err);
            done(err);
        });
    });


    it('describe to update Adapter Options',  function(done) {
      this.timeout(10000);
        Adapter.describe()
            .then(function(res) {
              expect(res.responseHeader.status).to.be.equal(0);
                // expect(Adapter.options.solrSchema.schema.fields).to.include({ name: 'test_to_delete_field',
                //   type: 'string',
                //   multiValued: false,
                //   indexed: true,
                //   stored: true });
                done();
            })
            .catch(function(err) {
                console.log('err', err);
                done(err);
            });
    });

  });

  describe('replaceField `test_to_delete_field`', function() {

    it('should return Status: OK',  function(done) {
      this.timeout(10000);
        Adapter.client().schema().replaceField({name:'test_to_delete_field', type:'pdate'})
        .then(function(res) {
            expect(res.responseHeader.status).to.be.equal(0);
            done();
        })
        .catch(function(err) {
            console.log('err', err);
            done(err);
        });
    });

  });

  describe('deleteField `test_to_delete_field`', function() {
        it('should return Status: OK',  function(done) {
          this.timeout(10000);
            Adapter.client().schema().deleteField([{name:'test_to_delete_field'}])
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                console.log('err', err);
                done(err);
            });
        });
  });



  describe('addDynamicField `*_test_dynamic_field`', function() {

    it('should return Status: OK',  function(done) {
      this.timeout(10000);
        Adapter.client().schema().addDynamicField({name:'*_test_dynamic_field', type:'string'})
        .then(function(res) {
            expect(res.responseHeader.status).to.be.equal(0);
            done();
        })
        .catch(function(err) {
            console.log('err', err);
            done(err);
        });
    });

  });

  describe('replaceDynamicField `*_test_dynamic_field`', function() {

    it('should return Status: OK',  function(done) {
      this.timeout(10000);
        Adapter.client().schema().replaceDynamicField({name:'*_test_dynamic_field', type:'pdate'})
        .then(function(res) {
            expect(res.responseHeader.status).to.be.equal(0);
            done();
        })
        .catch(function(err) {
            console.log('err', err);
            done(err);
        });
    });

  });

  describe('deleteDynamicField `*_test_dynamic_field`', function() {
        it('should return Status: OK',  function(done) {
          this.timeout(10000);
            Adapter.client().schema().deleteDynamicField([{name:'*_test_dynamic_field'}])
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                console.log('err', err);
                done(err);
            });
        });
  });



  describe('addFieldType `test_field_type`', function() {

    it('should return Status: OK',  function(done) {
      this.timeout(10000);
        Adapter.client().schema().addFieldType({name:'test_field_type', class:'solr.TextField'})
        .then(function(res) {
            expect(res.responseHeader.status).to.be.equal(0);
            done();
        })
        .catch(function(err) {
            console.log('err', err);
            done(err);
        });
    });

  });

  describe('replaceFieldType `test_field_type`', function() {

    it('should return Status: OK',  function(done) {
      this.timeout(10000);
        Adapter.client().schema().replaceFieldType({name:'test_field_type', class:'solr.BoolField'})
        .then(function(res) {
            expect(res.responseHeader.status).to.be.equal(0);
            done();
        })
        .catch(function(err) {
            console.log('err', err);
            done(err);
        });
    });

  });

  describe('deleteFieldType `test_field_type`', function() {
        it('should return Status: OK',  function(done) {
          this.timeout(10000);
            Adapter.client().schema().deleteFieldType([{name:'test_field_type'}])
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                console.log('err', err);
                done(err);
            });
        });
  });



  describe('addCopyField `"source":"name","dest":[ "_text_" ]`', function() {

    it('should return Status: OK',  function(done) {
      this.timeout(10000);
        Adapter.client().schema().addCopyField({"source":"name","dest":[ "_text_" ]})
        .then(function(res) {
            expect(res.responseHeader.status).to.be.equal(0);
            done();
        })
        .catch(function(err) {
            console.log('err', err);
            done(err);
        });
    });

  });

  describe('delete `"source":"name","dest":[ "_text_" ]`', function() {
        it('should return Status: OK',  function(done) {
          this.timeout(10000);
            Adapter.client().schema().deleteCopyField({ "source":"name", "dest":"_text_" })
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                console.log('err', err);
                done(err);
            });
        });
  });

});
