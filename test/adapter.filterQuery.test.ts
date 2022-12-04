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
    const query = Service.filterQuery(null, {})

    assert.deepStrictEqual(query, {
        query: '*:*',
        fields: '*',
        limit: 15,
        offset: 0,
        filter: []
    });
  })

  it('query with `paginate`', async () => {
    const { limit } = Service.filterQuery(null, { paginate: false })
    assert.equal(limit, 100);
  })

  it('query with `id`', async () => {
    const { filter } = Service.filterQuery('1', {})
    console.log({filter})
    assert.deepStrictEqual(filter, ['id:1']);
  })

  it('query with custom `id`', async () => {
    Service.options.id = '_id';
    const { filter } = Service.filterQuery('1', {})
    Service.options.id = 'id';
    console.log({filter})
    assert.deepStrictEqual(filter, ['_id:1']);
  })

  // it('query with `$search`', async () => {
  //   const { query } = Service.filterQuery(null, {
  //     query: {
  //       $search: 'name: john'
  //     }
  //   })
  //   console.log({query})
  //   assert.equal(query, 'jogn');
  // })
});
