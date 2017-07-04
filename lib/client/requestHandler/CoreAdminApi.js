'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * CoreAdmin API
 * https://cwiki.apache.org/confluence/display/solr/CoreAdmin+API
 */

var CoreAdminApi = function () {
    function CoreAdminApi(request, opts) {
        _classCallCheck(this, CoreAdminApi);

        this.options = {
            method: 'GET',
            uri: opts.url + '/admin/cores', // '/update/json' || /update/json/docs
            json: true,
            qs: {
                wt: 'json'
            }
        };

        this.request = request;
    }

    /* STATUS */


    _createClass(CoreAdminApi, [{
        key: 'status',
        value: function status(params) {

            this.options.qs = Object.assign(this.options.qs, {
                action: 'STATUS'
            }, params);

            return this.request(this.options);
        }

        /* CREATE */

    }, {
        key: 'create',
        value: function create(params) {

            this.options.qs = Object.assign(this.options.qs, {
                action: 'CREATE'
            }, params);

            return this.request(this.options);
        }

        /* RELOAD */

    }, {
        key: 'reload',
        value: function reload(params) {

            this.options.qs = Object.assign(this.options.qs, {
                action: 'RELOAD'
            }, params);

            return this.request(this.options);
        }

        /* RENAME */

    }, {
        key: 'rename',
        value: function rename(core, other) {

            this.options.qs = {
                action: 'RENAME',
                core: core,
                other: other
            };

            return this.request(this.options);
        }

        /* SWAP */

    }, {
        key: 'swap',
        value: function swap(core, other) {

            this.options.qs = {
                action: 'SWAP',
                core: core,
                other: other
                // async:
            };

            return this.request(this.options);
        }

        /* UNLOAD */

    }, {
        key: 'unload',
        value: function unload(params) {

            this.options.qs = Object.assign(this.options.qs, {
                action: 'UNLOAD'
            }, params);

            return this.request(this.options);
        }

        /* MERGEINDEXES */

    }, {
        key: 'mergeindexes',
        value: function mergeindexes(params) {

            this.options.qs = Object.assign(this.options.qs, {
                action: 'MERGEINDEXES'
            }, params);

            return this.request(this.options);
        }

        /* SPLIT */

    }, {
        key: 'split',
        value: function split(params) {

            this.options.qs = Object.assign(this.options.qs, {
                action: 'SPLIT'
            }, params);

            return this.request(this.options);
        }

        /* REQUESTSTATUS */

    }, {
        key: 'requeststatus',
        value: function requeststatus(params) {

            this.options.qs = Object.assign(this.options.qs, {
                action: 'REQUESTSTATUS'
            }, params);

            return this.request(this.options);
        }
    }]);

    return CoreAdminApi;
}();

exports.default = CoreAdminApi;
module.exports = exports['default'];