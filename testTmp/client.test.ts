//@ts-ignore
import assert from 'assert';
import { solrClient } from '../src/client';
import Solr from '../src';
//@ts-ignore
import { addSchema, deleteSchema, mockData } from '../test/seed';
const Client = solrClient('http://localhost:8983/solr');

const options = {
  host: 'http://localhost:8983/solr',
  core: 'gettingstarted'
}
//@ts-ignore
const Service = Solr(options);

describe('Schema', () => {
  beforeEach(done => setTimeout(done, 100));

  // before(async () => {
  //   try {
  //     await Client.post(`/${options.core}/schema`, {data: addSchema});
  //   } catch (error) {
  //     console.log(error)
  //   }
  // });

  after(async () => {
    try {
      await Client.post(`/${options.core}/schema`, {data: deleteSchema});
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
  //         price: 999
  //       });
  //       assert.strictEqual(Array.isArray(response), false);
  //       assert.strictEqual(response.id, mockData[0].id);
  //       assert.strictEqual(response.price, 999);
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

});
