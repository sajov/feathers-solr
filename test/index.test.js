const assert = require("assert");
const adapterTests = require("@feathersjs/adapter-tests");
const errors = require("@feathersjs/errors");
const feathers = require("@feathersjs/feathers");

const solr = require("../lib");
const Client = require("../lib").Client;
const options = {
  Model: new Client("http://localhost:8983/solr/techproducts"),
  paginate: {},
  events: ["testing"]
};
const events = ["testing"];
const app = feathers().use("techproducts", new solr(options));
const service = app.service("techproducts");

const tests = [
  ".options",
  ".events",
  "._get",
  "._find",
  "._create",
  "._update",
  "._patch",
  "._remove",
  ".get",
  ".get + $select",
  ".get + id + query",
  ".get + NotFound",
  ".get + id + query id",
  ".find",
  ".remove",
  ".remove + $select",
  ".remove + id + query",
  ".remove + multi",
  ".remove + id + query id",
  ".update",
  ".update + $select",
  ".update + id + query",
  ".update + NotFound",
  ".update + id + query id",
  ".patch",
  ".patch + $select",
  ".patch + id + query",
  ".patch multiple",
  ".patch multi query",
  ".patch + NotFound",
  ".patch + id + query id",
  ".create",
  ".create + $select",
  ".create multi",
  "internal .find",
  "internal .get",
  "internal .create",
  "internal .update",
  "internal .patch",
  "internal .remove",
  ".find + equal",
  ".find + equal multiple",
  ".find + $sort",
  ".find + $sort + string",
  ".find + $limit",
  ".find + $limit 0",
  ".find + $skip",
  ".find + $select",
  ".find + $or",
  ".find + $in",
  ".find + $nin",
  ".find + $lt",
  ".find + $lte",
  ".find + $gt",
  ".find + $gte",
  ".find + $ne",
  ".find + $gt + $lt + $sort",
  // ".find + $or nested + $sort",
  ".find + paginate",
  ".find + paginate + $limit + $skip",
  ".find + paginate + $limit 0",
  ".find + paginate + params"
];
// const testSuite = adapterTests([".create multi"]);
const testSuite = adapterTests(tests);

describe("Feathers Solr Service", () => {
  beforeEach(done => setTimeout(done, 50));

  before(async function() {
    await service.Model.post("schema/fields", {
      "add-field": {
        name: "name",
        type: "text_general",
        multiValued: false,
        indexed: true,
        stored: true
      }
    });
    await service.Model.post("schema/fields", {
      "add-field": {
        name: "age",
        type: "pint",
        multiValued: false,
        indexed: true,
        stored: true
      }
    });
    await service.Model.post("schema/fields", {
      "add-field": {
        name: "created",
        type: "boolean",
        multiValued: false,
        indexed: true,
        stored: true
      }
    });
  });

  it("is CommonJS compatible", () =>
    assert.strictEqual(typeof require("../lib"), "function"));

  it(".delete multi ", async () => {
    service.options.multi = ["remove"];
    await service.remove(null, { query: { id: "*" } });
    service.options.multi = false;
    const result = await service.find({});
    assert.ok(Array.isArray(result), "data is an array");
    assert.ok(result.length == 0, "data is an array");
    assert.ok(result.length == 0, "data is an array");
  });
  testSuite(app, errors, "techproducts");
});
