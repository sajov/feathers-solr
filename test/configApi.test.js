import { expect } from 'chai';
import plugin from '../../src';
var request = require('request-promise');
let Adapter = new plugin.Service();
let Client = Adapter.client();
// let Config = Client.config();
let response;

describe('Config Ap', () => {

    describe('Search Component', () => {

        it('Add search component', done => {
            Client.config({
                    'add-searchcomponent': {
                        'name': 'suggest',
                        'class': 'solr.SuggestComponent',
                        'suggester': {
                            'name': 'suggest',
                            'lookupImpl': 'FuzzyLookupFactory',
                            'dictionaryImpl': 'DocumentDictionaryFactory',
                            'field': 'name_autocomplete',
                            'suggestAnalyzerFieldType': 'string',
                            'buildOnStartup': 'true',
                            'buildOnCommit': 'true'
                        }
                    }
                })
                .then(function(res) {
                    response = res;
                    if(res.errorMessages) {
                        console.log(res.errorMessages);
                    }
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(response).to.not.have.property('errorMessages');
                    done();
                })
                .catch(function(err) {
                    console.log('err', err);
                    done();
                });
        });

        it('Add request handler', done => {
            Client.config({
              'add-requesthandler' : {
                  'startup':'lazy',
                  'name':'/suggest',
                  'class':'solr.SearchHandler',
                  'defaults':{
                    'suggest':true,
                    'suggest.count':10,
                    'suggest.dictionary':'suggest',
                    'spellcheck':'on',
                    'spellcheck.count':10,
                    'spellcheck.extendedResults':true,
                    'spellcheck.collate':true,
                    'spellcheck.maxCollations':10,
                    'spellcheck.maxCollationTries':10,
                    'spellcheck.accuracy':0.003,
                  },
                  'components':['spellcheck','suggest']
                }
            })
            .then(function(res) {
                response = res;
                if(res.errorMessages) {
                    console.log(res.errorMessages);
                }
                expect(res.responseHeader.status).to.be.equal(0);
                expect(response).to.not.have.property('errorMessages');
                done();
            })
            .catch(function(err) {
                console.log('err', err);
                done();
            });
        });

        it('Delete search component', done => {
            Client.config({
                    'delete-searchcomponent': 'suggest'
                })
                .then(function(res) {
                    response = res;
                    if(res.errorMessages) {
                        console.log(res.errorMessages);
                    }
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(response).to.not.have.property('errorMessages');
                    done();
                })
                .catch(function(err) {
                    console.log('err', err);
                    done();
                });
        });

        it('Delete request handler', done => {
            Client.config({
                    'delete-requesthandler': '/suggest'
                })
                .then(function(res) {
                    response = res;
                    if(res.errorMessages) {
                        console.log(res.errorMessages);
                    }
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(response).to.not.have.property('errorMessages');
                    done();
                })
                .catch(function(err) {
                    console.log('err', err);
                    done();
                });
        });


    });


});

