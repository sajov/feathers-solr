const assert = require('assert');
const adapterTests = require('@feathersjs/adapter-tests');
const errors = require('@feathersjs/errors');
const feathers = require('@feathersjs/feathers');

const solr = require('../lib');
const { fetch, undici } = require('../lib');
const options = {
  Model: new fetch('http://localhost:8983/solr/techproducts'),
  paginate: {},
  events: ['testing']
};

const app = feathers().use('techproducts', new solr(options));
const service = app.service('techproducts');
describe('hooks', function() {
  before(function() {
    // runs before all tests in this block
  });

  after(function() {
    // runs after all tests in this block
  });

  beforeEach(function() {
    // runs before each test in this block
  });

  afterEach(function() {
    // runs after each test in this block
  });

  // test cases
});
