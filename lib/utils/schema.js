'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.describeSchemaFields = describeSchemaFields;
exports.parseSchemaFields = parseSchemaFields;
exports.deleteSchemaFields = deleteSchemaFields;
exports.describe = describe;
exports.define = define;

var _tools = require('./tools');

var _ = _interopRequireWildcard(_tools);

var _feathersErrors = require('feathers-errors');

var _feathersErrors2 = _interopRequireDefault(_feathersErrors);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var debug = (0, _debug2.default)('feathers-solr');

function describeSchemaFields(fields) {

  var definition = [];
  Object.keys(fields).forEach(function (field, i) {

    var solrField = {
      'name': field,
      'type': 'string',
      'stored': true,
      'indexed': true,
      'multiValued': false
    };

    if (_.isObject(fields[field])) {
      solrField = Object.assign(solrField, fields[field]);
      if (fields[field].default || fields[field].defaultValue) {
        solrField.default = fields[field].default || fields[field].defaultValue;
      }
    } else {
      solrField.type = fields[field];
    }

    // 'docValues':fields[field].docValues,
    // 'sortMissingFirst':fields[field].sortMissingFirst,
    // 'sortMissingLast':fields[field].sortMissingLast,
    // 'multiValued':fields[field].multiValued,
    // 'omitNorms':fields[field].omitNorms,
    // 'omitTermFreqAndPositions':fields[field].omitTermFreqAndPositions,
    // 'omitPositions':fields[field].omitPositions,
    // 'termVectors':fields[field].termVectors,
    // 'termPositions':fields[field].termPositions,
    // 'termOffsets':fields[field].termOffsets,
    // 'termPayloads':fields[field].termPayloads,
    // 'required':fields[field].required,
    // 'useDocValuesAsStored':fields[field].useDocValuesAsStored,
    // 'large':fields[field].large,

    // if(fields[field].stored)

    definition.push(solrField);
  });
  return definition;
}

function parseSchemaFields(fields) {

  var schemaFields = {};
  if (Array.isArray(fields)) {
    fields.forEach(function (field) {
      if (_.has(field, 'name')) {
        schemaFields[field.name] = _.omit(field, 'name');
      }
    });
  } else {
    schemaFields = fields;
  }
  return _.omit(schemaFields, 'id', '_root_', '_text_', '_version_');
}

function deleteSchemaFields(fields) {

  var fieldsToDelete = [];
  fields = _.omit(fields, 'id', '_root_', '_text_', '_version_');
  Object.keys(fields).forEach(function (field, i) {
    fieldsToDelete.push({ name: field });
  });
  return fieldsToDelete;
}

function describe(Service) {
  var schemaApi = Service.Solr.schema();
  return new Promise(function (resolve, reject) {
    schemaApi.get().then(function (res) {
      Service.options.solrSchema = res;
      debug('feathers-solr describe');
      define(Service);
      resolve(res);
    }).catch(function (err) {
      debug('Service.find ERROR:', err);
      return reject(new _feathersErrors2.default.BadRequest(err));
    });
  });
}

function define(Service) {
  var _this = this;

  var schemaApi = Service.Solr.schema();
  var fields = Service.options.solrSchema.field;
  return new Promise(function (resolve, reject) {
    if (_.isObject(fields)) {
      Service.options.schema = fields;
    }

    if (Service.options.migrate === 'safe' || Service.options.managedScheme === false || _.isObject(Service.options.schema) === false) {
      return true;
    }
    debug('feathers-solr migrate start');

    if (Service.options.migrate === 'drop') {

      _this.remove().then(function () {
        debug('feathers-solr migrate drop data');

        schemaApi.deleteField(deleteSchemaFields(Service.options.schema)) ///
        .then(function (res) {
          debug('feathers-solr migrate reset schema', res);
          schemaApi.addField(describeSchemaFields(Service.options.schema)).then(function (res) {
            debug('feathers-solr migrate define schema', res.errors);
            resolve(res);
          }).catch(function (err) {
            debug('Service.define addField ERROR:', err);
            return reject(new _feathersErrors2.default.BadRequest(err));
          });
        }).catch(function (err) {
          debug('Service.define removeField ERROR:', err);
          return reject(new _feathersErrors2.default.BadRequest(err));
        });
      }).catch(function (err) {
        debug('Service.define remove ERROR:', err);
        return reject(new _feathersErrors2.default.BadRequest(err));
      });
    } else {
      /* define fields */
      schemaApi.addField(describeSchemaFields(Service.options.schema)).then(function (res) {
        debug('feathers-solr migrate define schema');
        resolve(res);
      }).catch(function (err) {
        debug('Service.define addField ERROR:', err);
        return reject(new _feathersErrors2.default.BadRequest(err));
      });
    }
  });
}