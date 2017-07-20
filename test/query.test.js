import { expect } from 'chai';
import plugin from '../src';

let Adapter = new plugin.Service({
    paginate: {
        default: 10,
        max: 100
    },
    schema: false,
    migrate: 'safe',
    adminKey: false,
    managedScheme: true

});

describe('Adapter', () => {

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

    it('Remove model data', done => {
        Adapter.remove(null,{modelfield:'query_tests'})
            .then(function(res) {
                // console.log('res.errors',res);
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                console.log('err', err);
                done(err);
            });
    });

    it('Remove docs {modelfield:query_tests}', done => {
        Adapter.client().schema().deleteField([{name:'moneytest'},{name:'multivaluedfield'},{name:'testintfield'},{name:'moneyfield'},{name:'modelfield'},{name:'countfield'},{name:'searchfield'}])
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                console.log('err', err.errors);
                done(err);
            });
    });

    describe('Define', () => {
        /*
        curl -X POST -H 'Content-type:application/json' --data-binary '{
          "add-field":{
             "name":"testintfield",
             "type":"int",
             "stored":true }
        }' http://localhost:8983/solr/gettingstarted/schema

        */
        it('create fields: OK', done => {
            Adapter.define({
                    todeletefield: 'string',
                    modelfield: 'string',
                    moneytest: {type:'currency'},
                    moneyfield: {type:'currency'},
                    testintfield: 'int',
                    searchfield: 'text_general',
                    multivaluedfield: {type:'text_general', multiValued: true},
                })
                .then(function(res) {
                    expect(res.responseHeader.status).to.be.equal(0);
                    done();
                })
                .catch(function(err) {
                    // console.log('err', err);
                    done(err);
                });
        });

        it('Schema should have new fields: OK', done => {
            Adapter.client().schema().fields()
                .then(function(res) {
                    // console.log('Schema res',res)
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(res.fields).to.deep.include({
                        "name": "modelfield",
                        "type": "string",
                        "multiValued": false,
                        "indexed": true,
                        "stored": true
                        });
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

        it('Schema delete a field: OK', done => {
            Adapter.client().schema().deleteField([{name:'todeletefield'}])
            .then(function(res) {
                expect(res.responseHeader.status).to.be.equal(0);
                done();
            })
            .catch(function(err) {
                console.log('err', err.errors);
                done(err);
            });
        });


        it('Schema should check field is deleted: OK', done => {
            Adapter.client().schema().fields()
                .then(function(res) {
                    // console.log('Schema res',res)
                    expect(res.responseHeader.status).to.be.equal(0);
                    expect(res.fields).to.not.include({name: 'todeletefield',type: 'strings'});
                    done();
                })
                .catch(function(err) {
                    done(err);
                });
        });

    });

    describe('Create', () => {

        it('Document count before should be: 0', done => {
            Adapter.find({query:{modelfield:'query_tests'}})
                .then(function(res) {
                    // console.log('res',res);
                    expect(res.total).to.be.equal(0);
                    expect(res.data.length).to.be.equal(0);
                    done();
                })
                .catch(function(err) {
                    console.log('err',err);
                    done(err);
                });
        });


        it('Create 10 Documents return an array of: 10', done => {
            var data = [];

            for (var i = 0; i < 10; i++) {
                data.push({
                    name: 'tester_' + (i + 1),
                    testintfield: (i +1),
                    moneytest: Math.floor((Math.random() * 100) + 1),
                    countfield: i + 1,
                    multivaluedfield:['a','b','c'],
                    searchfield: 'tester_' + (i + 1) + ' Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor ',
                    modelfield:'query_tests'
                })
            }
            // console.log(data)

            Adapter.create(data)
                .then(function(res) {
                    // console.log('res',res);
                    expect(res).to.be.an('array');
                    done();
                })
                .catch(function(err) {
                    console.log('err',err);
                    done(err);
                });
        });

        it('Document count should be: 10', done => {
            Adapter.find({query:{modelfield:'query_tests'}})
                .then(function(res) {
                    // console.log('res',res);
                    expect(res.total).to.be.equal(10);
                    expect(res.data.length).to.be.equal(10);
                    done();
                })
                .catch(function(err) {
                    console.log('err',err);
                    done(err);
                });
        });
    });

    describe('Update', () => {
        var result = {};
        it('find a Document to update: OK', done => {
            Adapter.find({query:{modelfield:'query_tests',name:'tester_5'}})
                .then(function(res) {
                    result = res.data[0];
                    delete result._version_;
                    result.searchfield = 'sajov';
                    result.moneytest = 999999999;
                    expect(res.total).to.be.equal(1);
                    done();
                })
                .catch(function(err) {
                    // console.log('err',err);
                    done(err);
                });
        });

        it('update the Document: OK', done => {
            Adapter.update(result.id, result)
                .then(function(res) {
                    result = res;
                    expect(res.name).to.be.equal('tester_5');
                    done();
                })
                .catch(function(err) {
                    // console.log('err',err);
                    done(err);
                });
        });

        it('find a Document to update: OK', done => {
            Adapter.find({query:{modelfield:'query_tests',name:'tester_5'}})
                .then(function(res) {

                    expect(res.total).to.be.equal(1);
                    expect(res.data.length).to.be.equal(1);
                    expect(res.data[0].name).to.be.equal('tester_5');
                    expect(res.data[0].searchfield).to.be.equal('sajov');
                    expect(res.data[0].moneytest).to.be.equal('999999999,USD');
                    done();
                })
                .catch(function(err) {
                    // console.log('err',err);
                    done(err);
                });
        });
    });

    describe('Patch', () => {

        var result = {};
        it('find a Document to patch: OK', done => {
            Adapter.find({query:{modelfield:'query_tests',name:'tester_5'}})
                .then(function(res) {
                    result = res.data[0];
                    delete result._version_;
                    result.searchfield = 'sajov';
                    result.moneytest = 999999999;
                    expect(res.total).to.be.equal(1);
                    done();
                })
                .catch(function(err) {
                    // console.log('err',err);
                    done(err);
                });
        });

        it('patch the Document: OK', done => {
            Adapter.patch(result.id,{super:'test',autocomplete:'no'})
                .then(function(res) {

                    expect(res[0].super).to.be.equal('test');
                    done();
                })
                .catch(function(err) {
                    // console.log('err',err);
                    done(err);
                });
        });


        it('find a Document to patch: OK', done => {
            Adapter.find({query:{modelfield:'query_tests',name:'tester_5'}})
                .then(function(res) {
                    expect(res.data[0].super[0]).to.be.equal('test');
                    done();
                })
                .catch(function(err) {
                    // console.log('err',err);
                    done(err);
                });
        });
    });

    describe('Query', () => {

        describe('Equality', () => {
            it('should return name tester_5', done => {
                Adapter.find({query:{name:'tester_5', modelfield:'query_tests', $limit:3}})
                    .then(function(res) {
                        expect(res.data[0].name).to.be.equal('tester_5');
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });


        describe('$limit', () => {
            var result = {};
            it('should set $limit 3', done => {
                Adapter.find({query:{modelfield:'query_tests', $limit:3}})
                    .then(function(res) {
                        result = res;
                        // expect(res.limit).to.be.equal(3);
                        // expect(res.total).to.be.equal(1);
                        // expect(res.data.length).to.be.equal(1);
                        // expect(res.data[0].name).to.be.equal('tester_4');
                        done();
                    })
                    .catch(function(err) {
                        console.log('err',err);
                        done(err);
                    });
            });

            it('should return data.length == 3', done => {
                expect(result.data.length).to.be.equal(3);
                done();
            })
        });

        describe('$skip', () => {
            it('should $skip 3', done => {
                Adapter.find({query:{modelfield:'query_tests',$sort:{name:1}, $limit:1, $skip:3}})
                    .then(function(res) {
                        expect(res.limit).to.be.equal(1);
                        expect(res.skip).to.be.equal(3);
                        expect(res.data[0].name).to.be.equal('tester_3');
                        done();
                    })
                    .catch(function(err) {
                        console.log('err',err)
                        done(err);
                    });
            });
        });

        describe('$sort', () => {
            it('should Documents sorted: asc', done => {
                Adapter.find({query:{modelfield:'query_tests',$limit:1, $sort:{name:-1}}})
                    .then(function(res) {
                        // console.log('res',res);
                        expect(res.limit).to.be.equal(1);
                        expect(res.data[0].name).to.be.equal('tester_9');
                        done();
                    })
                    .catch(function(err) {
                        console.log('err',err);
                        done(err);
                    });
            });

            it('should Documents sorted: desc', done => {
                Adapter.find({query:{modelfield:'query_tests',$limit:1, $sort:{name:1}}})
                    .then(function(res) {
                        // console.log('res',res);
                        expect(res.limit).to.be.equal(1);
                        expect(res.data[0].name).to.be.equal('tester_1');
                        done();
                    })
                    .catch(function(err) {
                        console.log('err',err);
                        done(err);
                    });
            });
        });

        describe('$select', () => {
            it('should return Documents with field name', done => {
                Adapter.find({query:{modelfield:'query_tests',$limit:1, $sort:{name:1},$select:'name'}})
                    .then(function(res) {
                        expect(Object.keys(res.data[0]).length).to.be.equal(1);
                        expect(Object.keys(res.data[0])[0]).to.be.equal('name');
                        expect(res.data).to.deep.include({name:'tester_1'});
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
            it('should return Documents with field name,testintfield', done => {
                Adapter.find({query:{modelfield:'query_tests',$limit:1, $sort:{name:1},$select:'name,testintfield'}})
                    .then(function(res) {
                        // console.log('res',res);
                        expect(Object.keys(res.data[0]).length).to.be.equal(2);
                        expect(Object.keys(res.data[0])[0]).to.be.equal('name');
                        expect(res.data).to.deep.include({name:'tester_1',testintfield:1});
                        done();
                    })
                    .catch(function(err) {
                        done(err);
                    });
            });
        });

        describe('$in', () => {
            it('should return docs $in', done => {
                Adapter.find({query:{name:{$in:['Maxwell Gilbert','Marsha Burns']},$select:'name',$sort:{name:1}}})
                    .then(function(res) {
                        // console.log('res',res);
                        expect(res.data[0].name).to.be.equal('Marsha Burns');
                        expect(res.data[1].name).to.be.equal('Maxwell Gilbert');
                        expect(res.total).to.be.equal(2);
                        done();
                    })
                    .catch(function(err) {
                        // console.log('err',err);
                        done(err);
                    });
            });
        });

        describe('$nin', () => {
            it('should return docs $nin', done => {
                Adapter.find({query:{name:{$in:['Maxwell Gilbert','Marsha Burns'], $nin:['Marsha Burns']},$select:'name',$sort:{name:1}}})
                    .then(function(res) {
                        // console.log('res',res);
                        expect(res.data[0].name).to.be.equal('Maxwell Gilbert');
                        expect(res.total).to.be.equal(1);
                        done();
                    })
                    .catch(function(err) {
                        // console.log('err',err);
                        done(err);
                    });
            });
        });

        describe('$lt', () => {
            it('should return $lt 20', done => {
                Adapter.find({query:{modelfield:'query_tests',testintfield:{$lt:2},$select:'testintfield',$sort:{testintfield:1}}})
                    .then(function(res) {
                        expect(res.total).to.be.equal(1);
                        expect(res.data.length).to.be.equal(1);
                        expect(res.data[0].testintfield).to.be.equal(1);
                        done();
                    })
                    .catch(function(err) {
                        // console.log('err',err);
                        done(err);
                    });
            });
        });

        describe('$lte', () => {
            it('should return status: OK', done => {
                 Adapter.find({query:{modelfield:'query_tests',testintfield:{$lte:2},$select:'testintfield',$sort:{testintfield:1}}})
                    .then(function(res) {
                        expect(res.total).to.be.equal(2);
                        expect(res.data.length).to.be.equal(2);
                        expect(res.data[0].testintfield).to.be.equal(1);
                        expect(res.data[1].testintfield).to.be.equal(2);
                        done();
                    })
                    .catch(function(err) {
                        // console.log('err',err);
                        done(err);
                    });
            });
        });

        describe('$gt', () => {
            it('should return status: OK', done => {
                Adapter.find({query:{modelfield:'query_tests', testintfield:{$gt:5},$select:'testintfield',$sort:{testintfield:1}}})
                    .then(function(res) {
                        expect(res.total).to.be.equal(5);
                        expect(res.data.length).to.be.equal(5);
                        expect(res.data[0].testintfield).to.be.equal(6);
                        expect(res.data[1].testintfield).to.be.equal(7);
                        done();
                    })
                    .catch(function(err) {
                        // console.log('err',err);
                        done(err);
                    });
            });
        });

        describe('$gte', () => {
            it('should return status: OK', done => {
                Adapter.find({query:{modelfield:'query_tests', testintfield:{$gte:5},$select:'testintfield',$sort:{testintfield:1}}})
                    .then(function(res) {
                        expect(res.total).to.be.equal(6);
                        expect(res.data.length).to.be.equal(6);
                        expect(res.data[0].testintfield).to.be.equal(5);
                        expect(res.data[1].testintfield).to.be.equal(6);
                        done();
                    })
                    .catch(function(err) {
                        // console.log('err',err);
                        done(err);
                    });
            });
        });

        describe('$ne', () => {
            it('should return status: OK', done => {
                Adapter.find({query:{modelfield:'query_tests', testintfield:{$nin:[1,2,3]},$select:'testintfield',$sort:{testintfield:1}}})
                    .then(function(res) {
                        // console.log('res',res);
                        expect(res.total).to.be.equal(7);
                        expect(res.data.length).to.be.equal(7);
                        expect(res.data[0].testintfield).to.be.equal(4);
                        expect(res.data[1].testintfield).to.be.equal(5);
                        done();
                    })
                    .catch(function(err) {
                        // console.log('err',err);
                        done(err);
                    });
            });
        });

        describe('$or', () => {
            it('should return status: OK', done => {
                 Adapter.find({query:{modelfield:'query_tests', $or:{testintfield:1, name:'tester_3'},$select:'testintfield',$sort:{testintfield:1}}})
                    .then(function(res) {
                        expect(res.total).to.be.equal(2);
                        expect(res.data.length).to.be.equal(2);
                        expect(res.data[0].testintfield).to.be.equal(1);
                        expect(res.data[1].testintfield).to.be.equal(3);
                        done();
                    })
                    .catch(function(err) {
                        // console.log('err',err);
                        done(err);
                    });
            });
        });
    });

    describe('Remove', () => {
        it('should return status: OK', done => {
            Adapter.remove(null,{modelfield:'query_tests'})
                .then(function(res) {
                    expect(res.responseHeader.status).to.be.equal(0);
                    done();
                })
                .catch(function(err) {
                    // console.log('err',err);
                    done(err);
                });
        });


        it('Document count should be: 0', done => {
            Adapter.find({query:{modelfield:'query_tests'}})
                .then(function(res) {
                    // console.log('res',res);
                    expect(res.total).to.be.equal(0);
                    expect(res.data.length).to.be.equal(0);
                    done();
                })
                .catch(function(err) {
                    console.log('err',err);
                    done(err);
                });
        });
    });

});
