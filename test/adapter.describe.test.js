import { expect } from 'chai';
import plugin from '../src';

let Adapter = new plugin.Service({
  paginate: {
    default: 10,
    max: 4
  },
  migrate: 'alter'
});


describe('Adapter', function() {

      describe('Describe', function() {

        it('returns Solr Schema',  function(done) {
          this.timeout(10000);
            Adapter.describe()
                .then(function(res) {
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(Adapter.options.solrSchema.schema).to.have.any.keys('name','version','uniqueKey','fieldTypes','fields','dynamicFields','copyFields');
                    expect(Adapter.options.solrSchema.schema.fields).to.not.include({ name: 'todeletefield',
                      type: 'string',
                      multiValued: false,
                      indexed: true,
                      stored: true });
                    done();
                })
                .catch(function(err) {
                    console.log('err', err);
                    done(err);
                });
        });

        it('has Adapter.options.solrSchema',  function() {
          expect(Adapter.options.solrSchema.schema).to.have.any.keys('name','version','uniqueKey','fieldTypes','fields','dynamicFields','copyFields');
        });


        it('has not Adapter.options.solrSchema.fields todeletefield',  function() {
          expect(Adapter.options.solrSchema.schema.fields).to.not.include({ name: 'todeletefield'});
        });

      });

      describe('Define', function() {

        it('has not field todeletefield',  function() {
            expect(Adapter.options.solrSchema.schema.fields).to.not.include({ name: 'todeletefield',
                  type: 'string',
                  multiValued: false,
                  indexed: true,
                  stored: true });
        });

        it('create`field todeletefield',  function(done) {
            // if(schema)
            this.timeout(20000);

            Adapter.define({
                    todeletefield: 'string',
                    // modelfield: 'string',
                    // moneytest: {type:'currency'},
                    // moneyfield: {type:'currency'},
                    // testintfield: 'int',
                    // searchfield: 'text_general',
                    // multivaluedfield: {type:'text_general', multiValued: true},
                })
                .then(function(res) {
                    expect(res.responseHeader.status).to.be.equal(0);
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('check if field todeletefield exists',  function(done) {
          this.timeout(10000);
            Adapter.describe()
                .then(function(res) {
                    expect(Adapter.options.solrSchema.schema.fields).to.not.include({ name: 'todeletefield',
                      type: 'string',
                      multiValued: false,
                      indexed: true,
                      stored: true });
                    done();
                })
                .catch(function(err) {
                    console.log('err', err);
                    done(err);
                });
        });

        it('has not Adapter.options.solrSchema.fields todeletefield',  function() {
          expect(Adapter.options.solrSchema.schema.fields).to.not.include({ name: 'todeletefield'});
        });
      });


    describe('reset Tests', function() {
        it('should return Status: OK',  function(done) {
          this.timeout(10000);
            Adapter.client().schema().deleteField([{name:'todeletefield'}])
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