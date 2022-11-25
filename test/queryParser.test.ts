import assert from 'assert';
import { jsonQuery } from '../src/query';

const escapeFn = (key: string, value: any) => {
  return { key, value }
}

describe('Query parser', () => {

  it('default `query`', async () => {
    const { query } = jsonQuery(null, {}, {}, {}, escapeFn)
    assert.deepStrictEqual(query, '*:*');
  })

  it('default `fields`', async () => {
    const { fields } = jsonQuery(null, {}, {}, {}, escapeFn)
    assert.deepStrictEqual(fields, '*,score');
  })

  it('default `limit`', async () => {
    const { limit } = jsonQuery(null, {}, {}, {}, escapeFn)
    assert.deepStrictEqual(limit, 10);
  })

  it('default `offset`', async () => {
    const { offset } = jsonQuery(null, {}, {}, {}, escapeFn)
    assert.deepStrictEqual(offset, 0);
  })

  it('equality', async () => {
    const { filter } = jsonQuery(null, {}, {
      read: false,
      roomId: 2
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, [ 'read:false', 'roomId:2' ]);
  })

  it.skip('$limit', async () => {
    const { filter, offset } = jsonQuery(null, {}, {
      $limit: 2, //TOOD: pagiante.default used instead of query.$limit
      read: false,
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, [ 'read:false' ]);
    assert.deepStrictEqual(offset, 2);
  })

  it.skip('$skip', async () => {
    const { offset } = jsonQuery(null, {}, {
      $skip: 5, //TOOD: offset is 0???
    }, {}, escapeFn)
    assert.deepStrictEqual(offset, 5);
  })

  it('$sort', async () => {
    const { sort } = jsonQuery(null, {
      $sort: {
        price: -1,
        createdAt: 1,
      }
    }, {}, {}, escapeFn)
    assert.deepStrictEqual(sort, 'price desc,createdAt asc');
  })

  it('$select', async () => {
    const { fields } = jsonQuery(null, {
      $select:  ['price', 'createdAt']
    }, {}, {}, escapeFn)
    assert.deepStrictEqual(fields, 'price,createdAt,id');
  })

  it('$in', async () => {
    const { filter }  = jsonQuery(null, {}, {
      roomId:  {
        $in: [2, 5]
      }
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['roomId:(2 OR 5)']);
  })

  it('$nin', async () => {
    const { filter }  = jsonQuery(null, {}, {
      roomId:  {
        $nin: [2, 5]
      }
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['!roomId:(2 OR 5)']);
  })

  it('$lt', async () => {
    const { filter }  = jsonQuery(null, {}, {
      roomId:  {
        $lt: 2
      }
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['roomId:[* TO 2}']);
  })

  it('$lte', async () => {
    const { filter }  = jsonQuery(null, {}, {
      roomId:  {
        $lte: 2
      }
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['roomId:[* TO 2]']);
  })

  it('$gt', async () => {
    const { filter }  = jsonQuery(null, {}, {
      roomId:  {
        $gt: 2
      }
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['roomId:{2 TO *]']);
  })

  it('$gte', async () => {
    const { filter }  = jsonQuery(null, {}, {
      roomId:  {
        $gte: 2
      }
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['roomId:[2 TO *]']);
  })

  it('$ne', async () => {
    const { filter }  = jsonQuery(null, {}, {
      roomId: {
        $ne: 2
      }
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['!roomId:2']);
  })

  it('$or', async () => {
    const { filter } = jsonQuery(null, {}, {
      $or: [
        { 1: { $in: ['a', 'f'] } },
        { 2: { $in: ['b', 'c'] } }
      ]
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['(1:(a OR f) OR 2:(b OR c))']);
  })

  it('$search', async () => {
    const { query } = jsonQuery(null, {}, {
      $search: 'hello world'
    }, {}, escapeFn)
    assert.deepStrictEqual(query, 'hello world');
  })

  // TODO: escape $search
  it('escapeFn', async () => {
    const { filter } = jsonQuery(null, {}, {
      title: 'hello:world'
    }, {}, (key: string, value: any) => {
      return { key, value: value.replace(/:/g, "\\:") }
    })
    assert.deepStrictEqual(filter, ['title:hello\\:world']);
  })

  it('$and', async () => {
    const { filter } = jsonQuery(null, {}, {
      1: 'a',
      2: 'b'
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['1:a', '2:b']);
  })

  it('$like', async () => {
    const { filter } = jsonQuery(null, {}, {
      title: {
        $like: 'hello'
      }
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['title:*hello*']);
  })

  it('$nlike', async () => {
    const { filter } = jsonQuery(null, {}, {
      title: {
        $nlike: 'hello'
      }
    }, {}, escapeFn)
    assert.deepStrictEqual(filter, ['!title:*hello*']);
  })

  it('complex', async () => {
    const query = jsonQuery(null, {
      $sort: {
        price: -1,
        createdAt: 1,
      },
      $limit: 3,
      $select: ['a','b','price','createdAt'],
      $skip: 5,
    }, {
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
    }, {}, escapeFn)

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

});
