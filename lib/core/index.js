const { addId, getIds, jsonQuery, patchQuery, deleteQuery, whitelist, defaultOperators } = require('./query');
const { responseFind, responseGet } = require('./response');

module.exports = {
  addId,
  getIds,
  jsonQuery,
  patchQuery,
  deleteQuery,
  whitelist,
  defaultOperators,
  responseFind,
  responseGet
};
