const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const { fetch, undici } = require('../lib');
const solr = require('../lib');
const options = {
  Model: new fetch('http://localhost:8983/solr/techproducts'),
  paginate: {},
  events: ['testing']
};
const app = feathers().use('fetch', new solr(options));
const service = app.service('fetch');
const schemaAdd = require('./solr/schema-add.json');
const schemaDelete = require('./solr/schema-delete.json');
describe('Schema API', function() {
  before(function(done) {
    service.Model.post('schema', schemaAdd)
      .then(res => {
        done();
      })
      .catch(err => {
        console.log('Error', err);
        done();
      });
  });

  after(function(done) {
    service.Model.post('schema', schemaDelete)
      .then(res => {
        done();
      })
      .catch(err => {
        console.log('Error', err);
        done();
      });
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  it('Should have a field type `text_auto`', async () => {
    const response = await service.Model.get('schema/fieldtypes/text_auto');
    assert.ok(response);
    assert.strictEqual(response.fieldType.name, 'text_auto', 'Got a field named text_auto');
  });

  it('Should have a field `autocomplete`', async () => {
    const response = await service.Model.get('schema/fields/autocomplete');
    assert.ok(response);
    assert.strictEqual(response.field.name, 'autocomplete', 'Got a field named autocomplete');
  });

  it('Should have a copy field `* => autocomplete`', async () => {
    const response = await service.Model.get('schema/copyfields');
    const field = response.copyFields.filter(f => {
      return f.source == '*' && f.dest == 'autocomplete';
    });
    assert.ok(response);
    assert.ok(field);
    assert.equal(field.length, 1, 'autocomplete', 'Got a field named autocomplete');
  });
});
