'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Solr ConfigSets API
 * https://lucene.apache.org/solr/guide/6_6/configsets-api.html
 */

var ConfigSets = function () {
    function ConfigSets(request, opts) {
        _classCallCheck(this, ConfigSets);

        this.options = {
            method: 'GET',
            uri: opts.url + '/admin/configs',
            json: true
        };

        this.request = request;
    }

    /* CREATE */


    _createClass(ConfigSets, [{
        key: 'create',
        value: function create(params) {

            this.options.qs = Object.assign({
                action: 'CREATE',
                name: 'myConfigSet',
                baseConfigSet: '_default',
                configSetProp: { immutable: false }
            }, params);

            return this.request(this.options);
        }

        /* DELETE */

    }, {
        key: 'delete',
        value: function _delete(params) {

            this.options.qs = Object.assign({
                action: 'DELETE'
            }, params);

            return this.request(this.options);
        }

        /* LIST */

    }, {
        key: 'list',
        value: function list(params) {

            this.options.qs = Object.assign({
                action: 'LIST'
            }, params);

            return this.request(this.options);
        }
    }]);

    return ConfigSets;
}();

exports.default = ConfigSets;
module.exports = exports.default;