import adapterTests from '@feathersjs/adapter-tests';
import errors from '@feathersjs/errors';
import { SolrService } from '../src';
import { httpClient } from '../src/httpClient';
import { createCore, deleteCore, addSchema, deleteSchema } from './seed';
import { feathers } from '@feathersjs/feathers';
import assert from 'assert';
const options = {
  host: 'http://localhost:8983/solr',
  core: 'test',
  filters: {
    $params: (value: any) => value,
    $facet: (value: any) => value,
    $filter: (value: any) => value,
    $search: (value: any) => value
  },
  operators: ['$like','$nlike'],
  //paginate: {default: 10}
}

const Client = httpClient(options.host);

const events = ['testing'];
const serviceName = '/people';
const idProp = 'id';
const app = feathers()
app.use('/people', new SolrService({ events, ...options }));

const testSuite = adapterTests([
  '.options',
  '.events',
  '._get',
  '._find',
  '._create',
  '._update',
  '._patch',
  '._remove',
  '.get',
  '.get + $select',
  '.get + id + query',
  '.get + NotFound',
  '.get + id + query id',
  '.find',
  '.find + paginate + query',
  '.remove',
  '.remove + $select',
  '.remove + id + query',
  '.remove + multi',
  '.remove + multi no pagination',
  '.remove + id + query id',
  '.update',
  '.update + $select',
  '.update + id + query',
  '.update + NotFound',
  '.update + id + query id',
  '.update + query + NotFound',
  '.patch',
  '.patch + $select',
  '.patch + id + query',
  '.patch multiple',
  '.patch multiple no pagination',
  '.patch multi query same',
  '.patch multi query changed',
  '.patch + query + NotFound',
  '.patch + NotFound',
  '.patch + id + query id',
  '.create',
  '.create + $select',
  '.create multi',
  'internal .find',
  'internal .get',
  'internal .create',
  'internal .update',
  'internal .patch',
  'internal .remove',
  '.find + equal',
  '.find + equal multiple',
  '.find + $sort',
  '.find + $sort + string',
  '.find + $limit',
  '.find + $limit 0',
  '.find + $skip',
  '.find + $select',
  '.find + $or',
  '.find + $in',
  '.find + $nin',
  '.find + $lt',
  '.find + $lte',
  '.find + $gt',
  '.find + $gte',
  '.find + $ne',
  '.find + $gt + $lt + $sort',
  '.find + $or nested + $sort',
  '.find + paginate',
  '.find + paginate + $limit + $skip',
  '.find + paginate + $limit 0',
  '.find + paginate + params',
  'params.adapter + paginate',
  'params.adapter + multi'
])

describe.skip('debug', () => {
  let doug: any
  let service: any

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

  beforeEach(async () => {
    service = app.service(serviceName)
    doug = await app.service(serviceName).create({
      name: 'Doug',
      age: 32
    })
  })

  afterEach(async () => {
    try {
      await app.service(serviceName).remove(null)
    } catch (error: any) {}
  })

  it('.remove + multi no pagination', async () => {
    try {
      await service.remove(doug[idProp])
    } catch (error: any) {}

    const count = 14
    const defaultPaginate = 10

    assert.ok(count > defaultPaginate, 'count is bigger than default pagination')

    const multiBefore = service.options.multi
    const paginateBefore = service.options.paginate

    try {
      service.options.multi = true
      service.options.paginate = {
        default: defaultPaginate,
        max: 100
      }

      const emptyItems = await service.find({ paginate: false })
      assert.strictEqual(emptyItems.length, 0, 'no items before')

      const createdItems = await service.create(
        Array.from(Array(count)).map((_, i) => ({
          name: `name-${i}`,
          age: 3,
          created: true
        }))
      )
      assert.strictEqual(createdItems.length, count, `created ${count} items`)

      const foundItems = await service.find({ paginate: false })
      assert.strictEqual(foundItems.length, count, `created ${count} items`)

      const foundPaginatedItems = await service.find({})
      assert.strictEqual(foundPaginatedItems.data.length, defaultPaginate, 'found paginated items')

      const allItems = await service.remove(null, {
        query: { created: true }
      })

      assert.strictEqual(allItems.length, count, `removed all ${count} items`)
    } finally {
      await service.remove(null, {
        query: { created: true },
        paginate: false
      })

      service.options.multi = multiBefore
      service.options.paginate = paginateBefore
    }
  })
})

describe('common adapter tests', () => {
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


  testSuite(app, errors, 'people');
});
