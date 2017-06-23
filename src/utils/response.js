'use strict';


import * as _ from './tools';
/**
 * Response parser
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @param  {object} opt    Solr response object
 * @return {object}        Adapter response
 */
export function responseFind(params, opt, res) {

  // console.log('Utils.responseFind',params);

  let response = {};

  if (_.has(opt, 'paginate.max')) {
    response = {
      QTime: _.get(res, 'response.QTime') || 0, //"<total number of records>",
      total: _.get(res, 'response.numFound') || 0, //"<total number of records>",
      limit: parseInt(_.get(params, '_query.$limit')) || _.get(opt, 'paginate.default') || _.get(opt, 'paginate.max'),
      skip: parseInt(_.get(params, '_query.$skip')) || 0, //res.response.start "<number of skipped items (offset)>",
      data: responseGet(res, true) //[/* data */]
    };
  } else {
      response = _.get(res, 'response.docs') || [];
  }

  if (_.has(res, 'facet_counts.facet_fields')) {
      response.facet = _.get(res, 'facet_counts.facet_fields');
  }

  return response;
}

/**
 * Response Docs parser
 * @param  {object} params Request params
 * @param  {object} opt    Adapter options
 * @param  {object} opt    Solr response object
 * @return {object}        Adapter response
 */
export function responseGet(res, allDocs = false) {

  let response = allDocs === false ? {} : [];

  if (!_.has(res, 'response.docs')) {
    return response;
  }

  let docs = _.get(res, 'response.docs') || [];

  return allDocs === false ? docs[0] : docs;
}
