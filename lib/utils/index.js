const uuidv1 = require("uuid/v1");
const {
  solrQuery,
  queryJson,
  querySuggest,
  queryDelete,
  queryPatch,
  defaultOperators
} = require("./query");

const getOrder = (sort = {}) =>
  Object.keys(sort).reduce((order, name) => {
    order.push([name, parseInt(sort[name], 10) === 1 ? "ASC" : "DESC"]);

    return order;
  }, []);

const isPlainObject = obj => {
  return obj && obj.constructor === {}.constructor;
};

const addId = (item, id) => {
  if (item[id] === undefined) {
    return Object.assign(
      {
        [id]: uuidv1()
      },
      item
    );
  }
  return item;
};

module.exports = {
  solrQuery,
  queryJson,
  querySuggest,
  queryDelete,
  queryPatch,
  defaultOperators,
  getOrder,
  isPlainObject,
  addId
};
