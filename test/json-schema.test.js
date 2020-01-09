const assert = require('assert');
const errors = require('@feathersjs/errors');
const JSONSchema = require('../lib/schema/json-schema');
const renameKeys2 = require('rename-keys');
const deepRename = require('deep-rename-keys');
const schema = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  '$id': 'http://example.com/product.schema.json',
  'title': 'Product',
  'description': "A product from Acme's catalog",
  'type': 'object',
  'properties': {
    'productId': {
      'description': 'The unique identifier for a product',
      'type': 'integer'
    },
    'name': {
      'description': 'The name a product',
      'type': 'string'
    },
    'attributes': {
      'description': "A product from Acme's catalog",
      'type': 'object',
      'properties': {
        'color': {
          'description': 'Color attribute',
          'type': 'integer'
        },
        'price': {
          'description': 'The price of a product',
          'type': 'string'
        },
        'stock': {
          'description': 'Shipping information',
          'type': 'object',
          'properties': {
            'deliveryTime': {
              'type': 'string'
            },
            'inStock': {
              'type': 'integer'
            },
            'maxQty': {
              'type': 'integer'
            }
          }
        }
      }
    }
  },
  'required': ['productId']
};
const aliasMap = {
  name: 'name_EN',
  price: 'price_EUR',
  color: 'attr_1_EN',
  maxQty: 'max_qty'
};

const jsonFields = ['attributes'];

const query = {
  $or: {
    name: 'Shirt',
    price: 19,
    color: 'red'
  }
};

describe('Feathers Solr Service Common Adapter Tests', () => {
  beforeEach(done => setTimeout(done, 100));

  before(async () => {
    this.schema = new JSONSchema({ schema, aliasMap, jsonFields });
  });

  after(async () => {});

  beforeEach(async () => {});

  afterEach(async () => {});

  it('is module', () => {
    assert.strictEqual(typeof JSONSchema, 'function');
    assert.strictEqual(typeof this.schema, 'object');
  });

  it('.validate', () => {
    assert.strictEqual(typeof this.schema.validate, 'function');
  });

  it('.query', () => {
    assert.strictEqual(typeof this.schema.query, 'function');
  });

  it('.rename is a function', () => {
    assert.strictEqual(typeof this.schema._rename, 'function');
  });

  it('.rename schema', () => {
    const renamedSchema = this.schema._rename(schema, aliasMap);
    // console.log(renamedSchema);
    // console.log(renamedSchema.properties.attributes);
    // console.log(renamedSchema.properties.attributes.properties.stock);
    assert.strictEqual(typeof this.schema._rename, 'function');
  });

  it('.rename query', () => {
    const renamedQuery = this.schema._rename(query, aliasMap);
    // console.log(renamedQuery);
    assert.strictEqual(typeof this.schema._rename, 'function');
  });
});
