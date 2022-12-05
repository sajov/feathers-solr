import assert from 'assert';
import { SolrService } from '../src/index';
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
  multi: true,
  paginate: { default: 15, max: 100 }
}

const Service = new SolrService(options);

describe('filterQuery', () => {
  it('empty query', async () => {
    const  query = Service.filterQuery(null, {})

    assert.deepStrictEqual(query, {
        query: '*:*',
        fields: '*,score',
        limit: 100,
        offset: 0,
        filter: []
    });
  })

  it('query with `paginate`', async () => {
    const { limit } = Service.filterQuery(null, { paginate: false })
    assert.equal(limit, 1000);
  })

  it('query with default `paginate`', async () => {
    const { limit } = Service.filterQuery(null, { paginate: { default: 3 } })
    assert.equal(limit, 3);
  })

  it('query with default `paginate` 0', async () => {
    const { limit } = Service.filterQuery(null, { query: { $limit: 0 } })
    assert.equal(limit, 0);
  })

  it('query with `id`', async () => {
    const { filter } = Service.filterQuery('1', {})
    assert.deepStrictEqual(filter, ['id:1']);
  })

  it('query with custom `id`', async () => {
    Service.options.id = '_id';
    const { filter } = Service.filterQuery('1', {})
    Service.options.id = 'id';
    assert.deepStrictEqual(filter, ['_id:1']);
  })



  it('query with simple `filter`', async () => {
    const { filter } = Service.filterQuery(null, {
      query: {
        name: 'john'
      }
    })
    assert.deepStrictEqual(filter, ['name:john']);
  })



  describe('operators', () => {
    it('query with `$gt`', async () => {
      const { filter } = Service.filterQuery(null, {
        query: {
          name: 'john',
          price: {$gt: 10}
        }
      })
      assert.deepStrictEqual(filter, ['name:john','price:{10 TO *]']);
    })
  })
  describe('filters', () => {

    it('query with `$search`', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $search: 'name: john'
        }
      })
      assert.equal(query, 'name: john');
    })

    it('query with `$limit` 0', async () => {
      const before = Service.options.paginate;
      Service.options.paginate = false;
      const { limit } = Service.filterQuery(null, {
        query: {
          $limit: 0
        }
      })
      Service.options.paginate = before;
      assert.deepStrictEqual(limit, 0);
    })

    it('query with `$limit`', async () => {
      const before = Service.options.paginate;
      Service.options.paginate = false;
      const { limit } = Service.filterQuery(null, {
        query: {
          $limit: 1
        }
      })
      Service.options.paginate = before;
      assert.deepStrictEqual(limit, 1);
    })

    it('query with `$skip`', async () => {
      const { offset } = Service.filterQuery(null, {
        query: {
          $skip: 1
        }
      })
      assert.deepStrictEqual(offset, 1);
    })

    it('query with `$sort`', async () => {
      const { sort } = Service.filterQuery(null, {
        query: {
          $sort: {name: 1, price: -1}
        }
      })
      assert.deepStrictEqual(sort, 'name asc,price desc');
    })

    it('query with empty `$select`', async () => {
      const { fields } = Service.filterQuery(null, {})
      assert.deepStrictEqual(fields, '*,score');
    })

    it('query with  `$select`', async () => {
      const { fields } = Service.filterQuery(null, {
        query: {
          $select: ['id','name']
        }
      })
      assert.deepStrictEqual(fields, 'id,name');
    })
  })
});
