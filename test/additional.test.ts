import assert from 'assert';
import { SolrService } from '../src';
import { httpClient } from '../src/httpClient';
import { createCore, deleteCore, addSchema, mockData, deleteSchema, addConfig, deleteConfig } from './seed';
import { feathers } from '@feathersjs/feathers';

const options = {
  host: 'http://localhost:8983/solr',
  core: 'test',
  createUUID: true,
  filters: {
    $params: (value: any) => value,
    $facet: (value: any) => value,
    $filter: (value: any) => value,
    $search: (value: any) => value
  },
  operators: ['$like','$nlike'],
  multi: true
}

const Client = httpClient(options.host);

const Service = new SolrService(options);

const events = ['testing'];

const app = feathers()

app.use('/people', new SolrService({ events, ...options, multi: false }));
app.use('/search', new SolrService({
  events,
  ...options,
  paginate: { max: 10, default: 5 },
  filters: {
    $params: (value: any) => value,
    $facet: (value: any) => value,
    $filter: (value: any) => value,
    $search: (value: any) => value
  },
  operators: ['$like','$nlike'],
  multi: true
}));
app.use('/app', new SolrService({
  events,
  ...options,
  paginate: { max: 10 },
  filters: {
    $params: (value: any) => value,
    $facet: (value: any) => value,
    $filter: (value: any) => value,
    $search: (value: any) => value
  },
  operators: ['$like','$nlike'],
  multi: true,
  createUUID: false,
  queryHandler: '/app',
  updateHandler: '/update/json'
}));

describe('additional adapter tests', () => {
  beforeEach(done => setTimeout(done, 100));

  before(async () => {
    await Client.get('/admin/cores', {
      params: {
        ...createCore,
        name: options.core
      }
    });
    await Client.post(`/${options.core}/schema`, { data: addSchema });
    await new SolrService({ ...options, multi: true })._remove(null, {});
  });

  after(async () => {
    await new SolrService({ ...options, multi: true })._remove(null, {});
    await Client.post(`/${options.core}/schema`, { data: deleteSchema });
    await Client.get('/admin/cores', {
      params: {
        ...deleteCore,
        core: options.core
      }
    });
  });

  describe('use service client', () => {
    it('get `query`', async () => {
      const { responseHeader, response } = await Service.client.get(`/${options.core}/query`, { params: { 'q': '*:*' } });

      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    })

    it('get `select`', async () => {
      const { responseHeader, response } = await Service.client.get(`/${options.core}/select`, { params: { 'q': '*:*' } });

      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    })

    it('post `query`', async () => {
      const { responseHeader, response } = await Service.client.post(`/${options.core}/query`, { data: { 'query': '*:*' } });

      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    })

    it('post `select`', async () => {
      const { responseHeader, response } = await Service.client.post(`/${options.core}/select`, { data: { 'query': '*:*' } });

      assert.strictEqual(typeof responseHeader.status, 'number');
      assert.strictEqual(typeof responseHeader.QTime, 'number');
      assert.strictEqual(typeof response.numFound, 'number');
      assert.strictEqual(typeof response.start, 'number');
      assert.strictEqual(Array.isArray(response.docs), true);
    })

    // it.skip('`createUUID`', async () => {
    //   await Service.create(mockData.map((d:any) => {
    //     delete d.id;
    //     return d;
    //   }));
    //   const result = await Service.find();
    //   assert.strictEqual(typeof result[0].id, 'string');
    //   assert.strictEqual(typeof result[1].id, 'string');
    //   assert.strictEqual(typeof result[2].id, 'string');
    // })
  });

  describe('methods', () => {

    it('`find` without params', async () => {
      const response = await Service.find();
      assert.strictEqual(Array.isArray(response), true);
    });

    it('`create` with empty array', async () => {
      try {
        await Service._create([]);
      } catch (error: any) {
        assert.strictEqual(typeof error.MethodNotAllowed, 'undefined', 'has MethodNotAllowed');
      }
    });

    it('`create` with empty object', async () => {
      try {
        await Service._create({});
      } catch (error: any) {
        assert.strictEqual(typeof error.MethodNotAllowed, 'undefined', 'has MethodNotAllowed');
      }
    });

    it('`create` one', async () => {
      const response = await Service._create(mockData[0]);

      assert.strictEqual(Array.isArray(response), false);
      assert.strictEqual(mockData[0].id, response.id);
    });

    it('`create` multi', async () => {
      const Service = new SolrService({
        ...options,
        multi: true
      });
      const response = await Service._create(mockData);

      assert.strictEqual(Array.isArray(response), true);
      assert.strictEqual(mockData[0].id, response[0].id);
    });

    it('`create` without ids', async () => {
      const { id, ...data } = mockData[0];
      const response = await Service._create(data);

      assert.strictEqual(Array.isArray(response), false);
      assert.strictEqual(typeof id, 'string');
      assert.strictEqual(typeof response.id, 'string');
    });


    it('`find` without pagination', async () => {
      const response = await Service._find({});
      assert.strictEqual(Array.isArray(response), true);
    });

    it('`find` with pagination', async () => {
      const Service = new SolrService({
        ...options,
        paginate: {
          default: 3,
          max: 5
        }
      });
      const response: any = await Service._find({});

      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(response.data.length, 3);
    });

    it('`find` $like', async () => {
      await app.service('search').create(mockData);
      const response: any = await app.service('search').find({ query: { city: { $like: 'cisc' } } });

      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(response.data.length, 1);
      assert.strictEqual(response.data[0].id, '3');
    });

    it('`find` $nlike', async () => {
      await app.service('search').remove(null, {});
      await app.service('search').create(mockData);
      const response: any = await app.service('search').find({ query: { city: { $nlike: 'cisc' } } });

      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(response.data.length, 2);
    });

    it('`get`', async () => {
      const response = await Service._get(mockData[0].id);

      assert.strictEqual(Array.isArray(response), false);
      assert.strictEqual(response.id, mockData[0].id);
    });

    it('`update`', async () => {
      const response = await Service.update(mockData[0].id, {
        ...mockData[0],
        age: 999
      });

      assert.strictEqual(Array.isArray(response), false);
      assert.strictEqual(response.id, mockData[0].id);
      assert.strictEqual(response.age, 999);
    });

    it('`update` with null throws error', async () => {
      try {
        await app.service('people').update(null, {});
        throw new Error('Should never get here');
      } catch (error: any) {
        assert.strictEqual(error.message, 'You can not replace multiple instances. Did you mean \'patch\'?');
      }
    });

    it('`update` with empty object', async () => {
      try {
        // @ts-ignore
        await Service.update(null, { id: 'aaa' });
      } catch (error: any) {
        assert.strictEqual(typeof error.NotFound, 'undefined', 'has NotFound');
      }
    });

    it('`update` select', async () => {
      await Service._create(mockData);
      const response = await Service.update(mockData[0].id,
        {
          ...mockData[0],
          test_s: 'test'
        },
        {
          query: {
            $select: ['name', 'test_s']
          }
        }
      );

      assert.strictEqual(typeof response.city, 'undefined');
      assert.strictEqual(typeof response.age, 'undefined');
      assert.strictEqual(typeof response.name, 'string');
      assert.strictEqual(typeof response.test_s, 'string');
    });

    it('`patch`', async () => {
      await Service._create(mockData);
      const response = await Service._patch('1', { age: 12 });

      assert.strictEqual(response.age, 12);
    });

    it('`patch` one by query', async () => {
      await Service._create(mockData);
      const response = await app.service('search').patch(null, { age: 12 }, { query: { age: 10 } });

      // @ts-expect-error 2339
      assert.strictEqual(response.age, 12);
    });

    it('`patch` atomic native set', async () => {
      await Service._create(mockData);
      await Service._patch('1', { age: { set: 99 } });
      const response = await Service.get('1');

      assert.strictEqual(response.age, 99);
    });

    it('`patch` atomic set', async () => {
      await Service._create(mockData);
      await Service._patch('1', { test_s: { set: 'test' } });
      const response = await Service.get('1');

      assert.strictEqual(response.test_s, 'test');
    });

    it('`patch` atomic remove', async () => {
      await Service._create(mockData);
      await Service._patch('1', { test_s: { set: 'test' } });
      const response = await Service.get('1');

      assert.strictEqual(response.test_s, 'test');

      await Service._patch('1', { test_s: {remove: 'test'} });
      const response2 = await Service.get('1');

      assert.strictEqual(response2.test_s, undefined);

      await Service._patch('1', { test_ss: { set: ['test1', 'test2'] } });
      const response3 = await Service.get('1');
      assert.deepEqual(response3.test_ss, ['test1', 'test2']);

      await Service._patch('1', { test_ss: {remove: 'test2'} });
      const response4 = await Service.get('1');
      assert.deepEqual(response4.test_ss, ['test1']);

      await Service._patch('1', { test_ss: { set: ['test1', 'test2'] } });
      await Service._patch('1', { test_ss: undefined });
      const response5 = await Service.get('1');
      assert.strictEqual(response5.test_s, undefined);
    });

    it('`patch` all', async () => {
      const service = app.service('search');
      await service.create(mockData);
      await service.patch(null, { test_s: { set: 'test' } });
      const response = await Service.find({ query: { test_s: 'test' }, paginate:false});

      assert.strictEqual(response.length, 3);
    });


    it('`patch` by query', async () => {
      const service = app.service('search');
      await service.create(mockData);
      await service.patch(null, { test_s: { set: 'test' } }, { query: { id: { $in: [1, 2] } } });
      const response = await Service.find({ query: { test_s: 'test' }, paginate:false });

      assert.strictEqual(response.length, 2);
    });

    it('`patch` select', async () => {
      const service = app.service('search');
      await service.create(mockData);
      const response = await service.patch(null, { test_s: { set: 'test' } }, { query: { $select: ['name', 'test_s'] } });

      assert.strictEqual(typeof response[0].city, 'undefined');
      assert.strictEqual(typeof response[0].age, 'undefined');
      assert.strictEqual(typeof response[0].name, 'string');
      assert.strictEqual(typeof response[0].test_s, 'string');
    });


    it('`grouped` response', async () => {
      await app.service('search').create(mockData);
      const response: any = await app.service('search').find({
        query: {
          $params: {
            'group': true,
            'group.field': 'city'
          }
        }
      });

      assert.strictEqual(typeof response.QTime, 'number');
      assert.strictEqual(response.total, 3);
      assert.strictEqual(response.skip, 0);
      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(response.data.length, 3);
    });

    it('`grouped` response simple format', async () => {
      await app.service('search').create(mockData);
      const response: any = await app.service('search').find({
        query: {
          $params: {
            'group': true,
            'group.field': 'city',
            'group.format': 'simple'
          }
        }
      });

      assert.strictEqual(typeof response.QTime, 'number');
      assert.strictEqual(response.total, 3);
      assert.strictEqual(response.skip, 0);
      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(response.data.length, 3);
    });

    it('`delete` by id', async () => {
      const response = await Service._remove(mockData[0].id);

      assert.strictEqual(response.id, mockData[0].id);

      const test: any = await Service._find({ query: { id: mockData[0].id } });

      assert.strictEqual(Array.isArray(test), true);
      assert.strictEqual(test.length, 0);
    });

    it('`delete` by query', async () => {
      const query = {
        id: {
          $in: mockData.slice(1, 3).map((d: any) => {
            return d.id;
          })
        }
      };

      const response = await Service._remove(null, { query });

      assert.strictEqual(Array.isArray(response), true);
      assert.strictEqual(response.length, 2);

      const test: any = await Service._find({ query });

      assert.strictEqual(Array.isArray(test), true);
      assert.strictEqual(test.length, 0);
    });

    it('`delete` all', async () => {
      const Service = new SolrService({
        ...options,
        multi: true
      });
      await Service._create(mockData);
      await Service._remove(null, {});
      const test: any = await Service._find({});
      assert.strictEqual(Array.isArray(test), true);
      assert.strictEqual(test.length, 0);
    });

    it('does not modify the original data', async () => {
      const people = app.service('people');
      const data = {
        name: 'Delete tester',
        age: 33
      };
      const person = await people.create(data);

      delete person.age;

      const otherPerson = await people.get(person.id);

      assert.strictEqual(otherPerson.age, 33);

      await people.remove(person.id);
    });

  });

  describe('aditional params', () => {

    before(async () => {
      await Service._create(mockData);
    });

    after(async () => {
      await Service._remove(null, {});
    });

    it('`$search` one term', async () => {
      const query = {
        $search: 'san'
      }
      const response: any = await app.service('search').find({ query });

      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(response.data[0].city, 'San Francisco');
    });

    it('`$search` two terms', async () => {
      const query = {
        $search: 'new san'
      }
      const response: any = await app.service('search').find({ query });

      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(response.data.length, 2);
    });

    it('`$params`', async () => {
      const query = {
        $params: {
          sort: 'age desc'
        }
      }
      const response: any = await app.service('search').find({ query });

      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(mockData[2].age, response.data[0].age);
      assert.strictEqual(mockData[1].age, response.data[1].age);
      assert.strictEqual(mockData[0].age, response.data[2].age);
    });

    it('`$facet`', async () => {
      const query = {
        $facet: {
          age_min: 'min(age)',
          age_max: 'max(age)',
          age_ranges: {
            type: 'range',
            field: 'age',
            start: 0,
            end: 100,
            gap: 50
          }
        }
      }
      const response: any = await app.service('search').find({ query });

      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(typeof response.facets, 'object');
      assert.strictEqual(response.facets.count, 3);
      assert.strictEqual(response.facets.age_min, 10);
      assert.deepStrictEqual(response.facets.age_ranges.buckets, [{ val: 0, count: 2 }, { val: 50, count: 1 }]);
    });

    it('`$filter`', async () => {
      const query = {
        $filter: ['age:19', 'city:London'],
        name: 'Alice'
      }
      const response: any = await app.service('search').find({ query });

      assert.strictEqual(Array.isArray(response.data), true);
      assert.strictEqual(response.data.length, 1);
      assert.strictEqual(response.data[0].name, 'Alice');
      assert.strictEqual(response.data[0].city, 'London');
      assert.strictEqual(response.data[0].age, 19);
    });

  });


  describe('application', () => {

    before(async () => {
      await Client.post(`/${options.core}/config`, { data: addConfig });
      await app.service('app').create(mockData);
    });

    after(async () => {
      await app.service('app').remove(null, {});
      await Client.post(`/${options.core}/config`, { data: deleteConfig });
    });

    it('has searchComponent `spellcheck`', async () => {
      const response = await Client.get(`/${options.core}/config`, {});
      assert.strictEqual(response.config.searchComponent.spellcheck.name, 'spellcheck');
    });

    it('has requesthandler `app`', async () => {
      const response = await Client.get(`/${options.core}/config`, {});
      assert.strictEqual(typeof response.config.requestHandler['/app'], 'object');
    });

    it('`app`', async () => {
      const query = {
        $search: 'san mike',
        $params: {
          'suggest.q': 's',
          'suggest.cfq': 'city',
          'suggest.build': 'true'
        },
        $facet: {
          age_min: 'min(age)',
          age_max: 'max(age)',
          age_ranges: {
            type: 'range',
            field: 'age',
            start: 0,
            end: 100,
            gap: 50
          }
        }
      };
      const response = await app.service('app').find({ query });

      assert.strictEqual(typeof response.facets, 'object');
      assert.strictEqual(typeof response.terms, 'object');
      assert.strictEqual(typeof response.spellcheck, 'object');
      assert.strictEqual(typeof response.suggest, 'object');
    });
  });
});
