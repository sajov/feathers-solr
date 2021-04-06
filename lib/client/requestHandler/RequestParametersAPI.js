'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Request Parameters API
 * https://cwiki.apache.org/confluence/display/solr/Request+Parameters+API
 */

var RequestParameters = exports.RequestParameters = function () {
    function RequestParameters(request, opts) {
        _classCallCheck(this, RequestParameters);

        this.options = {
            method: 'GET',
            uri: opts.urlCore + '/config/params',
            json: true
        };

        this.request = request;
    }

    /* SET */


    _createClass(RequestParameters, [{
        key: 'set',
        value: function set(params) {
            return this.request(this.options);
        }

        /* UNSET */

    }, {
        key: 'unset',
        value: function unset(params) {
            return this.request(this.options);
        }

        /* UPDATE */

    }, {
        key: 'update',
        value: function update(params) {
            return this.request(this.options);
        }
    }]);

    return RequestParameters;
}();