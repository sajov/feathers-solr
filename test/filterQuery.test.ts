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
  paginate: { default: 15, max: 100 },
  escapeFn: (key: string, value: any) => {
    return { key, value }
  }
}

const escapeFn = (key: string, value: any) => {
  return { key, value }
}

const Service = new SolrService(options);

describe('filterQuery', () => {
  it('empty query', async () => {
    const  {query} = Service.filterQuery(null, {})

    assert.deepStrictEqual(query, {
        query: '*:*',
        fields: '*,score',
        limit: 100,
        offset: 0,
        filter: []
    });
  })

  it('query with `paginate`', async () => {
    const { query } = Service.filterQuery(null, { paginate: false })

    assert.equal(query.limit, 15);
  })

  it('query with default `paginate`', async () => {
    const { query } = Service.filterQuery(null, { paginate: { default: 3 } })

    assert.equal(query.limit, 3);
  })

  it('query with default `paginate` 0', async () => {
    const { query } = Service.filterQuery(null, { query: { $limit: 0 } })

    assert.equal(query.limit, 0);
  })

  it('query with `id`', async () => {
    const { query } = Service.filterQuery('1', {})

    assert.deepStrictEqual(query.filter, ['id:1']);
  })

  it('query with custom `id`', async () => {
    Service.options.id = '_id';
    const { query } = Service.filterQuery('1', {})
    Service.options.id = 'id';

    assert.deepStrictEqual(query.filter, ['_id:1']);
  })

  describe('operators', () => {
    it('equality', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          read: false,
          roomId: 2
        }
      })

      assert.deepStrictEqual(query.filter, [ 'read:false', 'roomId:2' ]);
    })


    it('query with `$gt`', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          name: 'john',
          price: {$gt: 10}
        }
      })

      assert.deepStrictEqual(query.filter, ['name:john','price:{10 TO *]']);
    })
  })

  describe('filters', () => {

    it('query with `$search`', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $search: 'name: john'
        }
      })

      assert.equal(query.query, 'name: john');
    })

    it('query with `$limit` 0', async () => {
      const before = Service.options.paginate;
      Service.options.paginate = false;
      const { query } = Service.filterQuery(null, {
        query: {
          $limit: 0
        }
      })
      Service.options.paginate = before;

      assert.deepStrictEqual(query.limit, 0);
    })

    it('query with `$limit`', async () => {
      const before = Service.options.paginate;
      Service.options.paginate = false;
      const { query } = Service.filterQuery(null, {
        query: {
          $limit: 1
        }
      })
      Service.options.paginate = before;

      assert.deepStrictEqual(query.limit, 1);
    })

    it('query with `$skip`', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $skip: 1
        }
      })

      assert.deepStrictEqual(query.offset, 1);
    })

    it('query with `$sort`', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $sort: {name: 1, price: -1}
        }
      })

      assert.deepStrictEqual(query.sort, 'name asc,price desc');
    })

    it('query with `sort` as $param', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $params: {
            sort: 'age desc'
          }
        }
      })

      assert.deepStrictEqual(query.params, {sort: 'age desc'});
    });

    it('`$facet`', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
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
      })

      assert.deepStrictEqual(query.facet, {
        age_min: "min(age)",
        age_max: "max(age)",
        age_ranges: {
          type: "range",
          field: "age",
          start: 0,
          end: 100,
          gap: 50,
        },
      });
    });

    it('query with empty `$select`', async () => {
      const { query } = Service.filterQuery(null, {})

      assert.deepStrictEqual(query.fields, '*,score');
    })

    it('query with  `$select`', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $select: ['id','name']
        }
      })

      assert.deepStrictEqual(query.fields, 'id,name');
    })

    it('$in', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          roomId: { $in: [2, 5] }
        }
      })

      assert.deepStrictEqual(query.filter, ['roomId:(2 OR 5)']);
    })

    it('$nin', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          roomId: { $nin: [2, 5] }
        }
      })

      assert.deepStrictEqual(query.filter, ['!roomId:(2 OR 5)']);
    })


    it('$lt', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          roomId:  {
            $lt: 2
          }
        }
      })

      assert.deepStrictEqual(query.filter, ['roomId:[* TO 2}']);
    })

    it('$lte', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          roomId:  {
            $lte: 2
          }
        }
      })

      assert.deepStrictEqual(query.filter, ['roomId:[* TO 2]']);
    })

    it('$gt', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          roomId:  {
            $gt: 2
          }
        }
      })

      assert.deepStrictEqual(query.filter, ['roomId:{2 TO *]']);
    })

    it('$gte', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          roomId:  {
            $gte: 2
          }
        }
      })

      assert.deepStrictEqual(query.filter, ['roomId:[2 TO *]']);
    })

    it('$ne', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          roomId: {
            $ne: 2
          }
        }
      })

      assert.deepStrictEqual(query.filter, ['!roomId:2']);
    })

    it('$or', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $or: [
            { 1: { $in: ['a', 'f'] } },
            { 2: { $in: ['b', 'c'] } }
          ]
        }
      })

      assert.deepStrictEqual(query.filter, ['(1:(a OR f) OR 2:(b OR c))']);
    })

    it('$or nested', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $sort: { name: 1 },
          $or: [
            { name: 'Doug' },
            {
              age: {
                $gte: 18,
                $lt: 25
              }
            }
          ]
        }
      })

      assert.deepStrictEqual(query, {
           fields: '*,score',
           filter: [
             '(name:Doug OR (age:[18 TO *] AND age:[* TO 25}))'
           ],
           limit: 100,
           offset: 0,
           query: '*:*',
           sort: 'name asc'
      });
    })

    it('$search', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $search: 'hello world'
        }
      })

      assert.deepStrictEqual(query.query, 'hello world');
    })

    // TODO: escape $search
    it('escapeFn', async () => {
      Service.options.escapeFn = (key: string, value: any) => {
        return { key, value: value.replace(/:/g, '\\:') }
      }
      const { query } = Service.filterQuery(null, {
        query: {
          title: 'hello:world'
        }
      })
      Service.options.escapeFn = escapeFn;

      assert.deepStrictEqual(query.filter, ['title:hello\\:world']);
    })

    it('$and', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          1: 'a',
          2: 'b'
        }
      })

      assert.deepStrictEqual(query.filter, ['1:a', '2:b']);
    })

    it('$like', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          title: {
            $like: 'hello'
          }
        }
      })

      assert.deepStrictEqual(query.filter, ['title:*hello*']);
    })

    it('$nlike', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          title: {
            $nlike: 'hello'
          }
        }
      })

      assert.deepStrictEqual(query.filter, ['!title:*hello*']);
    })

    it('complex', async () => {
      const { query } = Service.filterQuery(null, {
        query: {
          $sort: {
            price: -1,
            createdAt: 1
          },
          $limit: 3,
          $select: ['a','b','price','createdAt'],
          $skip: 5,
          $search: 'hello world',
          review: {
            $like: 'cool'
          },
          id:  {
            $nin: [2, 5]
          },
          region: {
            $nlike: 'north'
          },
          price:  {
            $gte: 2,
            $lte: 10
          },
          age:  {
            $gt: 100,
            $lt: 10
          },
          channel: {
            $ne: 2
          },
          $or: [
            { 1: { $in: ['a', 'f'] } },
            { 2: { $in: ['b', 'c'] } }
          ]
        }
      })

      assert.deepStrictEqual(query, {
        query: 'hello world',
        fields: 'a,b,price,createdAt,id',
        limit: 3,
        offset: 5,
        sort: 'price desc,createdAt asc',
        filter: [
          'review:*cool*',
          '!id:(2 OR 5)',
          '!region:*north*',
          '(price:[2 TO *] AND price:[* TO 10])',
          '(age:{100 TO *] AND age:[* TO 10})',
          '!channel:2',
          '(1:(a OR f) OR 2:(b OR c))'
        ]
      });
    })

  })
});
