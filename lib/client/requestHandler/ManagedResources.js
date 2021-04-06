'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Solr Managed Resources
 * https://lucene.apache.org/solr/guide/6_6/managed-resources.html
 */

var ManagedResources = exports.ManagedResources = function () {
    function ManagedResources(request, opts) {
        _classCallCheck(this, ManagedResources);

        this.options = {
            method: 'GET',
            uri: opts.urlCore + '/schema/analysis',
            json: true
        };

        this.request = request;
    }

    /* ADD */


    _createClass(ManagedResources, [{
        key: 'add',
        value: function add(params) {
            this.options.uri += '/stopwords/english';
            this.options.qs = Object.assing({
                action: 'STATUS'
            }, params);

            return this.request(this.options);
        }

        /* DELETE */

    }, {
        key: 'delete',
        value: function _delete(params) {

            this.options.qs = Object.assing({
                action: 'STATUS'
            }, params);

            return this.request(this.options);
        }

        /* LIST */

    }, {
        key: 'list',
        value: function list(params) {

            this.options.qs = Object.assing({
                action: 'STATUS'
            }, params);

            return this.request(this.options);
        }
    }]);

    return ManagedResources;
}();