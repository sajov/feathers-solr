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

const app = feathers().use("techproducts", new solr(options));
const service = app.service("techproducts");

describe("Feathers Solr Service", () => {
  // beforeEach(done => setTimeout(done, 10));

  before(async function() {});

  describe("Whitelisted params", () => {
    it("should accept $search", async () => {
      const result = await service.find({ query: { $search: true } });
      assert.ok(Array.isArray(result), "result is array");
    });
    it("should accept $suggest", async () => {
      const result = await service.find({ query: { $suggest: true } });
      assert.ok(Array.isArray(result), "result is array");
    });
    it("should accept $params", async () => {
      const result = await service.find({ query: { $params: true } });
      assert.ok(Array.isArray(result), "result is array");
    });
    it("should accept $facet", async () => {
      const result = await service.find({ query: { $facet: true } });
      assert.ok(Array.isArray(result), "result is array");
    });
    it("should accept $populate", async () => {
      const result = await service.find({ query: { $populate: true } });
      assert.ok(Array.isArray(result), "result is array");
    });
  });

  describe("Test Query Parser", () => {
    it(".complex multi ", async () => {
      const solr = {
        filter: ["name:Doug", "age:{18 TO 25]", "id:( 1 OR 2 OR 3)"]
      };
      const response = await service.find({
        query: {
          $select: ["name", "age"],
          id: "jklfdjslkjr34j32lk5",
          $search: "stars",
          roomId: {
            $in: [2, 5]
          },
          color: { $ne: "red" },
          location: "Ohio",
          mail: "in@web.com",
          kids: {
            $gte: 2,
            $lt: 5
          },
          $or: [
            { name: "Doug" },
            { id: { $in: [1, 2, 3] } },
            {
              age: {
                $gte: 18,
                $lt: 25
              }
            }
          ],
          $sort: { name: 1 }
        },
        paginate: { max: 3, default: 4 }
      });
      console.log(response);
      assert.ok(response);
    });
  });
});
