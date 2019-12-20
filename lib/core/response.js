const { _ } = require('@feathersjs/commons');

/**
 * Response parser
 */
function responseFind(filters, query, paginate, res) {
  let response = {};
  if (!_.has(paginate, 'max') && !_.has(paginate, 'default')) {
    response = _.get(res, 'response.docs') || [];
  } else {
    response = {
      QTime: _.get(res, 'responseHeader.QTime') || 0,
      total: _.get(res, 'response.numFound') || 0,
      limit: parseInt(_.get(filters, '$limit')) || _.get(paginate, 'default') || _.get(paginate, 'max'),
      skip: parseInt(_.get(filters, '$skip')) || 0,
      data: responseGet(res, true)
    };

    ['facets', 'highlighting', 'spellcheck', 'moreLikeThis'].forEach(d => {
      if (_.has(res, d)) response[d] = res[d];
    });
  }
  return response;
}

/**
 * Response Docs parser
 */
function responseGet(res, allDocs = false) {
  if (!_.has(res, 'response.docs') && !_.has(res, 'grouped')) {
    return allDocs === false ? {} : [];
  }

  const docs = _.get(res, 'response.docs') || _.get(res, 'grouped') || [];

  return allDocs === false ? docs[0] : docs;
}

module.exports = {
  responseFind,
  responseGet
};
