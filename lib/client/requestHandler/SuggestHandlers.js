'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = SuggestHandlers;
/**
 * Solr Suggester
 * @method Suggest
 * @typicalname instance
 * [Solr Suggester Lucid](https://wiki.apache.org/solr/Suggester)
 * [Suggester cwiki](https://cwiki.apache.org/confluence/display/solr/Suggester)
 * [Suggester wiki](https://lucidworks.com/2015/03/04/solr-suggester/)
 *
 * @param  {object} request Request
 * @param  {object} opts    Options
 * @param  {object} query   Query
 * @return {object}         Promise
 */
function SuggestHandlers(request, opts, query) {

    var options = {
        method: 'POST',
        uri: opts.coreUrl + '/suggest',
        qs: Object.assign({
            wt: 'json'
        }, query),
        json: true
    };
    // console.log('Suggest', options);

    return request.get(options);
}
module.exports = exports['default'];