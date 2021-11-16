import assert from 'assert';
//@ts-ignore
import adapterTests from '@feathersjs/adapter-tests';
//@ts-ignore
import errors from '@feathersjs/errors';
import { solrClient } from '../src/client';
import { feathers } from '@feathersjs/feathers';
import { addSchema } from './seed';
import Solr from '../src';

const options = {
  host: 'http://localhost:8983/solr',
  core: 'gettingstarted'
}

//@ts-ignore
const Client = solrClient(options);
//@ts-ignore
const Service = Solr(options);


//@ts-ignore
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
]);

describe('Feathers Solr Service', () => {
  beforeEach(done => setTimeout(done, 100));

  before(async () => {
    await Client.post(`/${options.core}/schema`, addSchema);
  });

  const events = [ 'testing' ];
  const app = feathers()
    .use('/people', Solr({ events, ...options }))
    .use('/people-customid', Solr({
      id: 'customid', events, ...options
    }));

    it('`delete` all', async () => {
      const Service = Solr({
        ...options,
        multi: true
      });
      await Service._remove(null, {});
      const test = await Service._find({});
      assert.strictEqual(Array.isArray(test), true);
      assert.strictEqual(test.length, 0);
    });


  it('patch record with prop also in query', async () => {
    app.use('/animals', Solr({ multi: true, ...options }));
    const animals = app.service('animals');
    const t = await animals.create([{
      type: 'cat',
      age: 30
    }, {
      type: 'dog',
      age: 10
    }]);
console.log(t,'!!!!!!')
// const [updated] = await animals.patch(null, { age: 40 }, { query: { age: 30 } });
const find = await animals.find({ query: { age: 30 } });

console.log(find,'????')
    // assert.strictEqual(updated.age, 40);

    await animals.remove(null, {});
  });

  it('does not modify the original data', async () => {
    const people = app.service('people');

    const person = await people.create({
      name: 'Delete tester',
      age: 33
    });

    delete person.age;

    const otherPerson = await people.get(person.id);

    assert.strictEqual(otherPerson.age, 33);

    await people.remove(person.id);
  });

  it('does not $select the id', async () => {
    const people = app.service('people');
    const person = await people.create({
      name: 'Tester'
    });
    const results = await people.find({
      query: {
        name: 'Tester',
        $select: ['name']
      }
    });

    assert.deepStrictEqual(results[0], { name: 'Tester' },
      'deepEquals the same'
    );

    await people.remove(person.id);
  });

  it('update with null throws error', async () => {
    try {
      await app.service('people').update(null, {});
      throw new Error('Should never get here');
    } catch (error: any) {
      assert.strictEqual(error.message, 'You can not replace multiple instances. Did you mean \'patch\'?');
    }
  });

  // testSuite(app, errors, 'people');
  // testSuite(app, errors, 'people-customid', 'customid');
});
