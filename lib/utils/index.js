const {
  queryJson,
  querySuggest,
  queryDelete,
  queryPatch,
  defaultOperators
} = require("./query");

exports.getOrder = (sort = {}) =>
  Object.keys(sort).reduce((order, name) => {
    order.push([name, parseInt(sort[name], 10) === 1 ? "ASC" : "DESC"]);

    return order;
  }, []);

exports.isPlainObject = obj => {
  return obj && obj.constructor === {}.constructor;
};
module.exports = {
  queryJson,
  querySuggest,
  queryDelete,
  queryPatch,
  defaultOperators
};
