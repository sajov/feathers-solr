const { _ } = require('@feathersjs/commons');
const debug = require('debug')('feathers-solr-migration-fieldTypes');

class Migration {
  constructor(options) {
    if (!options.service) throw Error('service required');
    if (!options.newSchema) throw Error('newSchema required');
    if (!options.currentSchema) throw Error('currentSchema required');

    this.service = options.service;
    this.newSchema = options.newSchema.schema;
    this.currentSchema = options.currentSchema.schema;
    // Options safe, alter and drop.
    this.migrate = options.migrate || 'safe';

    this.schemaCommands = {
      safe: ['add-field-type', 'add-field', 'add-copy-field']
    };
    this.schemaCommands.alter = ['replace-field', 'replace-field-type'].concat(this.schemaCommands.safe);
    this.schemaCommands.drop = ['detele-copy-field', 'detele-field', 'detele-field-type'].concat(this.schemaCommands.alter);

    this.map = {
      fieldTypes: 'field-type',
      fields: 'field',
      dynamicFields: 'dynamic-field',
      copyFields: 'copy-field'
    };

    this.whiteListFields = ['id', '_root_', '_version_', '_text_'];

    // Commands for Solr Schema API
    this.migrationCommands = [];
    this.migrationCommandsErrors = [];
  }
  execute() {
    if (this.migrationCommands.length == 0) {
      debug('Nothing to migrate');
      return 'Nothing to migrate';
    }

    if (!this.schemaCommands[this.migrate]) throw new Error(`Option migrate must be one of safe, alter or drop. Is '${this.migrate}'`);

    return this.schemaCommands[this.migrate];
  }

  convert(type) {
    this.migrationCommands = [];
    const types = type ? [type] : Object.keys(this.map);
    types.forEach(key => {
      if (_.isEqual(this.currentSchema[key], this.newSchema[key])) {
        debug(`${key} are up to date`);
        return;
      }
      this.migrationCommands = this.migrationCommands.concat(this.commands(key));
    });
    return this.migrationCommands;
  }

  commands(type) {
    const result = [];
    const addKey = `add-${this.map[type]}`;
    const deleteKey = `delete-${this.map[type]}`;
    const replaceKey = `replace-${this.map[type]}`;
    this.newSchema[type].forEach(newDef => {
      let currentDef = this.getByName(this.currentSchema[type], newDef.name);
      if (!currentDef || !_.isEqual(currentDef, newDef)) {
        result.push({
          [!currentDef || type == 'copyFields' ? addKey : replaceKey]: newDef
        });
      }
    });

    this.currentSchema[type].forEach(currentDef => {
      let newDef = this.getByName(this.newSchema[type], currentDef.name);
      if (!newDef && this.whiteListFields.indexOf(currentDef.name) == -1) {
        result.push({
          [deleteKey]: currentDef.name
        });
      }
    });
    return result;
  }

  getByName(list, name) {
    return list.filter(f => f.name == name)[0];
  }
}
module.exports = Migration;
