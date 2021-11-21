//@ts-ignore
import assert from 'assert';
//@ts-ignore
import adapterTests from '@feathersjs/adapter-tests';
//@ts-ignore
import errors from '@feathersjs/errors';
import { solrClient } from '../src/client';
//@ts-ignore
import { createCore, deleteCore, addSchema, deleteSchema, mockData } from './seed';
import Solr from '../src';
//@ts-ignore
import { feathers } from '@feathersjs/feathers';

const options = {
  host: 'http://localhost:8983/solr',
  core: 'test'
}

//@ts-ignore
const Client = solrClient(options.host);
//@ts-ignore
const Service = Solr(options);
//@ts-ignore
const testSuite = adapterTests([
  // '.options',
  // '.events',
  // '._get',
  // '._find',
  // '._create',
  // '._update',
  // '._patch',
  // '._remove',
  // '.get',
  // '.get + $select',
  // '.get + id + query',
  // '.get + NotFound',
  // '.get + id + query id',
  // '.find',
  // '.find + paginate + query',
  // '.remove',
  // '.remove + $select',
  // '.remove + id + query',
  // '.remove + multi',
  // '.remove + id + query id',
  // '.update',
  // '.update + $select',
  // '.update + id + query',
  // '.update + NotFound',
  // '.update + id + query id',
  // '.update + query + NotFound',
  // '.patch',
  // '.patch + $select',
  // '.patch + id + query',
  // '.patch multiple',
  // '.patch multi query same',
  // '.patch multi query changed',
  // '.patch + query + NotFound',
  // '.patch + NotFound',
  // '.patch + id + query id',
  // '.create',
  // '.create + $select',
  // '.create multi',
  // 'internal .find',
  // 'internal .get',
  // 'internal .create',
  // 'internal .update',
  // 'internal .patch',
  // 'internal .remove',
  // '.find + equal',
  // '.find + equal multiple',
  // '.find + $sort',
  // '.find + $sort + string',
  // '.find + $limit',
  // '.find + $limit 0',
  // '.find + $skip',
  // '.find + $select',
  // '.find + $or',
  // '.find + $in',
  // '.find + $nin',
  // '.find + $lt',
  // '.find + $lte',
  // '.find + $gt',
  // // HERER
  // '.find + $gte',
  // '.find + $ne',
  // '.find + $gt + $lt + $sort',
  // '.find + $or nested + $sort',
  // '.find + paginate',
  '.find + paginate + $limit + $skip',
  // '.find + paginate + $limit 0',
  // '.find + paginate + params',
  // 'params.adapter + paginate',
  // 'params.adapter + multi'
]);

describe('Feathers Solr Service', () => {
  beforeEach(done => setTimeout(done, 100));

  before(async () => {
    try {
      // await Client.post(`/admin/cores`, {data: {
      //   ...createCore,
      //   name: options.core
      // }});
      await Client.post(`/${options.core}/schema`, {data: addSchema});
      await  Solr({
          ...options,
          multi: true
        })._remove('*');
    } catch (error) {
      console.log(error)
    }
  });

  after(async () => {
    try {
      await Client.post(`/${options.core}/schema`, {data: deleteSchema});
      // await Client.post(`/admin/cores`, {data: {
      //   ...deleteCore,
      //   core: options.core
      // }});
    } catch (error) {
      console.log(error)
    }
  });

  // describe('Client', () => {
  //   describe('\'methods\' ', () => {
  //     it('get `select`', async () => {
  //       const { responseHeader, response } = await Client.get(`/${options.core}/select`, { params: { "q": "*:*" } });
  //       assert.strictEqual(typeof responseHeader.status, 'number');
  //       assert.strictEqual(typeof responseHeader.QTime, 'number');
  //       assert.strictEqual(typeof response.numFound, 'number');
  //       assert.strictEqual(typeof response.start, 'number');
  //       assert.strictEqual(Array.isArray(response.docs), true);
  //     });

  //     it('post `query`', async () => {
  //       const {responseHeader, response} = await Client.post(`/${options.core}/query`, { data: { "query": "*:*" } } );
  //       assert.strictEqual(typeof responseHeader.status, 'number');
  //       assert.strictEqual(typeof responseHeader.QTime, 'number');
  //       assert.strictEqual(typeof response.numFound, 'number');
  //       assert.strictEqual(typeof response.start, 'number');
  //       assert.strictEqual(Array.isArray(response.docs), true);
  //     });
  //   });
  // })

  // describe('Service', () => {
  //   describe('\'client\' ', () => {
  //     it('get `query`', async () => {
  //       const {responseHeader, response}  = await Service.client.get(`/${options.core}/query`, {params: { "q": "*:*" }});
  //       assert.strictEqual(typeof responseHeader.status, 'number');
  //       assert.strictEqual(typeof responseHeader.QTime, 'number');
  //       assert.strictEqual(typeof response.numFound, 'number');
  //       assert.strictEqual(typeof response.start, 'number');
  //       assert.strictEqual(Array.isArray(response.docs), true);
  //     })

  //     it('get `select`', async () => {
  //       const {responseHeader, response}  = await Service.client.get(`/${options.core}/select`, {params: { "q": "*:*" }});
  //       assert.strictEqual(typeof responseHeader.status, 'number');
  //       assert.strictEqual(typeof responseHeader.QTime, 'number');
  //       assert.strictEqual(typeof response.numFound, 'number');
  //       assert.strictEqual(typeof response.start, 'number');
  //       assert.strictEqual(Array.isArray(response.docs), true);
  //     })

  //     it('post `query`', async () => {
  //       const {responseHeader, response}  = await Service.client.post(`/${options.core}/query`, {data: { "query": "*:*" }});
  //       assert.strictEqual(typeof responseHeader.status, 'number');
  //       assert.strictEqual(typeof responseHeader.QTime, 'number');
  //       assert.strictEqual(typeof response.numFound, 'number');
  //       assert.strictEqual(typeof response.start, 'number');
  //       assert.strictEqual(Array.isArray(response.docs), true);
  //     })

  //     it('post `select`', async () => {
  //       const {responseHeader, response}  = await Service.client.post(`/${options.core}/select`, {data: { "query": "*:*" }});
  //       assert.strictEqual(typeof responseHeader.status, 'number');
  //       assert.strictEqual(typeof responseHeader.QTime, 'number');
  //       assert.strictEqual(typeof response.numFound, 'number');
  //       assert.strictEqual(typeof response.start, 'number');
  //       assert.strictEqual(Array.isArray(response.docs), true);
  //     })
  //   });

  //   describe('\'methods\' ', () => {

  //     it('`create` one', async () => {
  //       const response  = await Service._create(mockData[0]);
  //       assert.strictEqual(Array.isArray(response), false);
  //       assert.strictEqual(mockData[0].id, response.id);
  //     });

  //     it('`create` multi', async () => {
  //       const Service = Solr({
  //         ...options,
  //         multi: true
  //       });
  //       const response  = await Service._create(mockData);
  //       assert.strictEqual(Array.isArray(response), true);
  //       assert.strictEqual(mockData[0].id, response[0].id);
  //     });

  //     it('`create` without ids', async () => {
  //       const {id, ...data} = mockData[0];
  //       const response  = await Service._create(data);
  //       assert.strictEqual(Array.isArray(response), false);
  //       assert.strictEqual(typeof response.id, 'string');
  //     });

  //     it('`find` without pagination', async () => {
  //       const response  = await Service._find({});
  //       assert.strictEqual(Array.isArray(response), true);
  //     });

  //     it('`find` with pagination', async () => {
  //       const Service = Solr({
  //         ...options,
  //         paginate: {
  //           default: 3,
  //           max: 5
  //         }
  //       });
  //       const response  = await Service._find({});
  //       assert.strictEqual(Array.isArray(response.data), true);
  //       assert.strictEqual(response.data.length, 3);
  //     });

  //     it('`get`', async () => {
  //       const response  = await Service._get(mockData[0].id);
  //       assert.strictEqual(Array.isArray(response), false);
  //       assert.strictEqual(response.id, mockData[0].id);
  //     });

  //     it('`update`', async () => {
  //       const response  = await Service._update(mockData[0].id, {
  //         ...mockData[0],
  //         age: 999
  //       });
  //       assert.strictEqual(Array.isArray(response), false);
  //       assert.strictEqual(response.id, mockData[0].id);
  //       assert.strictEqual(response.age, 999);
  //     });

  //     it('`path`', async () => {
  //       assert.strictEqual(1, 1);
  //     });

  //     it('`delete` by id', async () => {
  //       const response  = await Service._remove(mockData[0].id);
  //       assert.strictEqual(response.id, mockData[0].id);
  //       const test = await Service._find({query: {id: mockData[0].id}});
  //       assert.strictEqual(Array.isArray(test), true);
  //       assert.strictEqual(test.length, 0);
  //     });

  //     it('`delete` by query', async () => {
  //       const query = {
  //         id: {
  //           $in: mockData.slice(1,3).map((d:any) => {
  //             return d.id;
  //           })
  //         }
  //       };

  //       const response  = await Service._remove(null, { query });
  //       assert.strictEqual(Array.isArray(response), true);
  //       assert.strictEqual(response.length, 2);

  //       const test = await Service._find({ query });
  //       assert.strictEqual(Array.isArray(test), true);
  //       assert.strictEqual(test.length, 0);
  //     });

  //     it('`delete` all', async () => {
  //       const Service = Solr({
  //         ...options,
  //         multi: true
  //       });
  //       await Service._create(mockData);
  //       await Service._remove('*');
  //       const test = await Service._find({});
  //       assert.strictEqual(Array.isArray(test), true);
  //       assert.strictEqual(test.length, 0);
  //     });

  //     it('`delete` all', async () => {
  //       const Service = Solr({
  //         ...options,
  //         multi: true
  //       });
  //       await Service._create(mockData);
  //       await Service._remove(null, {});
  //       const test = await Service._find({});
  //       assert.strictEqual(Array.isArray(test), true);
  //       assert.strictEqual(test.length, 0);
  //     });
  //   });
  // })

  const events = [ 'testing' ];
  //@ts-ignore
  const app = feathers()
    .use('/people', Solr({ events, ...options, multi: false }))
    // .use('/people-customid', Solr({
    //   id: 'customid', events, ...options
    // }));

  //     it('`delete` all', async () => {
  //       const Service = Solr({
  //         ...options,
  //         multi: true
  //       });
  //       await Service._remove(null, {});
  //       const test = await Service._find({});
  //       assert.strictEqual(Array.isArray(test), true);
  //       assert.strictEqual(test.length, 0);
  //     });


  //   it('patch record with prop also in query', async () => {
  //     app.use('/animals', Solr({ multi: true, ...options }));
  //     const animals = app.service('animals');
  //     const t = await animals.create([{
  //       type: 'cat',
  //       age: 30
  //     }, {
  //       type: 'dog',
  //       age: 10
  //     }]);
  // console.log(t,'!!!!!!')
  // // const [updated] = await animals.patch(null, { age: 40 }, { query: { age: 30 } });
  // const find = await animals.find({ query: { age: 30 } });

  // console.log(find,'????')
  //     // assert.strictEqual(updated.age, 40);

  //     await animals.remove(null, {});
  //   });

  //   it('does not modify the original data', async () => {
  //     const people = app.service('people');

  //     const person = await people.create({
  //       name: 'Delete tester',
  //       age: 33
  //     });

  //     delete person.age;

  //     const otherPerson = await people.get(person.id);

  //     assert.strictEqual(otherPerson.age, 33);

  //     await people.remove(person.id);
  //   });

  //   it('does not $select the id', async () => {
  //     const people = app.service('people');
  //     const person = await people.create({
  //       name: 'Tester'
  //     });
  //     const results = await people.find({
  //       query: {
  //         name: 'Tester',
  //         $select: ['name']
  //       }
  //     });

  //     assert.deepStrictEqual(results[0], { name: 'Tester' },
  //       'deepEquals the same'
  //     );

  //     await people.remove(person.id);
  //   });

  //   it('update with null throws error', async () => {
  //     try {
  //       await app.service('people').update(null, {});
  //       throw new Error('Should never get here');
  //     } catch (error: any) {
  //       assert.strictEqual(error.message, 'You can not replace multiple instances. Did you mean \'patch\'?');
  //     }
  //   });



  // it('DUDE', async () => {
  //   // await app.service('people').remove(null, {});
  //   await app.service('people').create(mockData[0]);
  //   await app.service('people').create(mockData[1]);
  //   await app.service('people').create(mockData[2]);
  //   await app.service('people').remove(mockData[0].id);
  //   await app.service('people').remove(mockData[1].id);
  //   await app.service('people').remove(mockData[2].id);
  //   const res = await app.service('people').find({});
  //   console.log(res)
  //   // await app.service('people').remove(null, {});
  //     assert.deepStrictEqual(res.length, 0);

  //   });
  testSuite(app, errors, 'people');
  // testSuite(app, errors, 'people-customid', 'customid');
});
