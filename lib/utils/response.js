'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseFind = responseFind;
exports.responseGet = responseGet;

var _tools = require('./tools');

var _ = _interopRequireWildcard(_tools);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Response parser
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @param  {object} opt    Solr response object
 * @return {object}        Adapter response
 */
function responseFind(params, opt, res) {

  var response = {};

  if (_.has(opt, 'paginate.max')) {
    //TODO: ??
    response = {
      QTime: _.get(res, 'responseHeader.QTime') || 0, //"<total number of records>",
      total: _.get(res, 'response.numFound') || 0, //"<total number of records>",
      limit: parseInt(_.get(params, 'query.$limit')) || _.get(opt, 'paginate.default') || _.get(opt, 'paginate.max'),
      skip: parseInt(_.get(params, 'query.$skip')) || 0, //res.response.start "<number of skipped items (offset)>",
      data: responseGet(res, true) //[/* data */]
    };
  } else {
    response = _.get(res, 'response.docs') || [];
  }

  if (_.has(res, 'facets')) {
    response.facet = _.get(res, 'facets');
  }

  if (_.has(res, 'spellcheck')) {
    response.spellcheck = _.get(res, 'spellcheck');
  }

  return response;
}

/**
 * Response Docs parser
 * @param  {[type]}  res     [description]
 * @param  {Boolean} allDocs [description]
 * @return {[type]}          [description]
 */
function responseGet(res) {
  var allDocs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


  if (!_.has(res, 'response.docs') && !_.has(res, 'grouped')) {
    return allDocs === false ? {} : [];
  }

  var docs = _.get(res, 'response.docs') || _.get(res, 'grouped') || [];

  return allDocs === false ? docs[0] : docs;
}