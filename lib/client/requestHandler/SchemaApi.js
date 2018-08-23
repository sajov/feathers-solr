'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Schema API
 * @typicalname instance
 * https://cwiki.apache.org/confluence/display/solr/Managed+Resources
 * https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API
 */
var Schema = function () {

  /**
   * @method Constructor
   * @param  {object} request Request
   * @param  {object} opts    Default Request params
   * @return {object}         Promise
   */
  function Schema(request, opts) {
    _classCallCheck(this, Schema);

    this.options = {
      method: 'POST',
      uri: opts.coreUrl + '/schema',
      json: true
    };

    this.request = request;
  }

  /**
   * @method Req request method
   * @param  {object} opts Options
   * @return {object}      Returns a Promise
   */


  _createClass(Schema, [{
    key: '_req',
    value: function _req(opts) {
      return this.request(Object.assign({}, this.options, opts));
    }
  }, {
    key: 'schema',
    value: function schema() {
      return this._req({ method: 'GET' });
    }

    /**
     * @method Name
     * @param  {object} opts Options
     * @return {object}      Returns a Promise
     */

  }, {
    key: 'name',
    value: function name() {
      return this._req({ uri: this.options.uri + '/name', method: 'GET' });
    }
    /* /schema/version: retrieve the schema version */

  }, {
    key: 'version',
    value: function version() {
      return this._req({ uri: this.options.uri + '/version', method: 'GET' });
    }
    /* /schema/uniquekey: retrieve the defined uniqueKey */

  }, {
    key: 'uniquekey',
    value: function uniquekey() {
      return this._req({ uri: this.options.uri + '/uniquekey', method: 'GET' });
    }
    /* /schema/similarity: retrieve the global similarity definition */

  }, {
    key: 'similarity',
    value: function similarity() {
      return this._req({ uri: this.options.uri + '/similarity', method: 'GET' });
    }
    /* /schema/fields: retrieve information about all defined fields or a specific named field */

  }, {
    key: 'fields',
    value: function fields() {
      return this._req({ uri: this.options.uri + '/fields', method: 'GET' });
    }
    /* /schema/dynamicfields: retrieve information about all dynamic field rules or a specific named dynamic rule */

  }, {
    key: 'dynamicfields',
    value: function dynamicfields() {
      return this._req({ uri: this.options.uri + '/dynamicfields', method: 'GET' });
    }
    /* /schema/fieldtypes: retrieve information about all field types or a specific field type */

  }, {
    key: 'fieldtypes',
    value: function fieldtypes() {
      return this._req({ uri: this.options.uri + '/fieldtypes', method: 'GET' });
    }
    /* /schema/copyfields: retrieve information about copy fields */

  }, {
    key: 'copyfields',
    value: function copyfields() {
      return this._req({ uri: this.options.uri + '/copyfields', method: 'GET' });
    }

    /* /schema/solrqueryparser/defaultoperator: retrieve the default operator */

  }, {
    key: 'solrqueryparser',
    value: function solrqueryparser() {
      return this._req({ uri: this.options.uri + '/solrqueryparser/defaultoperator', method: 'GET' });
    }

    /* add-field: add a new field with parameters you provide.
        curl -X POST -H 'Content-type:application/json' --data-binary '{
          "add-field":[
             { "name":"shelf",
               "type":"myNewTxtField",
               "stored":true },
             { "name":"location",
               "type":"myNewTxtField",
               "stored":true }]
        }' http://localhost:8983/solr/gettingstarted/schema
    */

  }, {
    key: 'addField',
    value: function addField(params) {
      this.options.body = { 'add-field': params };
      // console.log('add-field', this.options.body);
      return this.request(this.options);
    }
    /* delete-field: delete a field. */

  }, {
    key: 'deleteField',
    value: function deleteField(params) {
      this.options.body = {
        'delete-field': params
      };
      // this.options.qs = {
      //     'delete-field' : params
      // };
      // console.log('deleteField', this.options.body);
      return this.request(this.options);
    }
    /* replace-field: replace an existing field with one that is differently configured. */

  }, {
    key: 'replaceField',
    value: function replaceField(params) {
      this.options.qs = {
        'replace-field': params
      };
      return this.request(this.options);
    }
    /* add-dynamic-field: add a new dynamic field rule with parameters you provide. */

  }, {
    key: 'addDynamicField',
    value: function addDynamicField(params) {
      this.options.qs = {
        'add-dynamic-field': params
      };
      return this.request(this.options);
    }
    /* delete-dynamic-field: delete a dynamic field rule. */

  }, {
    key: 'deleteFynamicField',
    value: function deleteFynamicField(params) {
      this.options.qs = {
        'delete-dynamic-field': params
      };
      return this.request(this.options);
    }
    /* replace-dynamic-field: replace an existing dynamic field rule with one that is differently configured. */

  }, {
    key: 'replaceFynamicField',
    value: function replaceFynamicField(params) {
      this.options.qs = {
        'replace-dynamic-field': params
      };
      return this.request(this.options);
    }
    /* add-field-type: add a new field type with parameters you provide. */

  }, {
    key: 'addFieldType',
    value: function addFieldType(params) {
      this.options.qs = {
        'add-field-type': params
      };
      return this.request(this.options);
    }
    /* delete-field-type: delete a field type. */

  }, {
    key: 'deleteFieldType',
    value: function deleteFieldType(params) {
      this.options.qs = {
        'delete-field-type': params
      };
      return this.request(this.options);
    }
    /* replace-field-type: replace an existing field type with one that is differently configured. */

  }, {
    key: 'replaceFieldType',
    value: function replaceFieldType(params) {
      this.options.qs = {
        'replace-field-type': params
      };
      return this.request(this.options);
    }
    /* add-copy-field: add a new copy field rule. */

  }, {
    key: 'addCopyField',
    value: function addCopyField(params) {
      this.options.qs = {
        'add-copy-field': params
      };
      return this.request(this.options);
    }
    /* delete-copy-field: delete a copy field rule. */

  }, {
    key: 'deleteCopyField',
    value: function deleteCopyField(params) {
      this.options.qs = {
        'delete-copy-field': params
      };
      return this.request(this.options);
    }
  }]);

  return Schema;
}();

exports.default = Schema;
module.exports = exports['default'];