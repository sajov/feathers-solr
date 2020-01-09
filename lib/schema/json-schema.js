const { _ } = require('@feathersjs/commons');
const debug = require('debug')('feathers-solr-migration-fieldTypes');
const rename = require('deep-rename-keys');

module.exports = class JSONSchema {
  constructor(options) {
    this.schema = options.schema || {};
    this.jsonFields = options.jsonFields || [];
    this.aliases = options.aliases || [];
  }

  validate() {}
  query() {}
  select() {}
  _rename(obj, map) {
    return rename(obj, function(key, val) {
      return map[key] || key;
    });
  }
};
