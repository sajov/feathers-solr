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
  // multi: true,
  // paginate: { default: 10, max: 1000 }
};

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
  // ".create multi",
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
const testSuite = adapterTests(tests);

describe("Feathers Solr Service", () => {
  beforeEach(done => setTimeout(done, 1000));
  afterEach(done => setTimeout(done, 1000));

  const events = ["testing"];
  const app = feathers().use("techproducts", new solr(options));
  app
    .service("techproducts")
    .remove(null, { query: { id: "*" } })
    .catch(err => console.log(err));
  app
    .service("techproducts")
    .options.Model.post("schema/fields", {
      "add-field": {
        name: "name",
        type: "text_general",
        multiValued: false,
        indexed: true,
        stored: true
      },
      "add-field": {
        name: "age",
        type: "pint",
        multiValued: false,
        indexed: true,
        stored: true
      },
      "add-field": {
        name: "created",
        type: "boolean",
        multiValued: false,
        indexed: true,
        stored: true
      }
    })
    .catch(err => console.log("ERR", err));

  it("is CommonJS compatible", () =>
    assert.strictEqual(typeof require("../lib"), "function"));

  it("create with string id works", async () => {
    const techproducts = app.service("techproducts");

    const product = await techproducts.create({
      id: "Tester",
      name: "Test Product",
      action_s: "create",
      date_s: new Date()
    });

    assert.strictEqual(typeof product.id, "string");
    assert.equal(product.action_s, "create");

    // await techproducts.remove(product.id);
  });
  testSuite(app, errors, "techproducts");
  // it("update with string id works", async () => {
  //   const techproducts = app.service("techproducts");

  //   const product = await techproducts.get("Tester");

  //   const updatedProduct = await techproducts.update(
  //     product.id.toString(),
  //     Object.assign(product, { action_s: "update" })
  //   );

  //   assert.strictEqual(typeof updatedProduct.id, "string");
  //   assert.equal(updatedProduct.action_s, "update");

  //   const productNew = await techproducts.get("Tester");
  //   // console.log(productNew);
  //   assert.strictEqual(typeof productNew.id, "string");
  //   // assert.equal(productNew.action_s, "update");

  //   await techproducts.remove(product.id);
  // });

  // it("find with complex query works", async () => {
  //   const techproducts = app.service("techproducts");

  //   const cerateProduct = await techproducts.create([
  //     {
  //       id: "1",
  //       name: "Dude",
  //       action_s: "create",
  //       date_s: new Date()
  //     },
  //     {
  //       id: "2",
  //       name: "Dude",
  //       action_s: "create",
  //       date_s: new Date()
  //     }
  //   ]);

  //   const findProduct = await techproducts.find({
  //     $limit: 1,
  //     $skip: 0
  //   });
  //   console.log(findProduct);
  //   // const updatedProduct = await techproducts.update(
  //   //   product.id.toString(),
  //   //   Object.assign(product, { action_s: "update" })
  //   // );

  //   // await techproducts.remove(product.id);
  // });

  // it("find with complex query works", async () => {
  //   const techproducts = app.service("techproducts");

  //   const findProduct = await techproducts.find({
  //     query: {
  //       $search: "*:*",
  //       // $limit: 1,
  //       // $limit: 1,
  //       $skip: 0,
  //       $params: { rows: 1 }
  //       // $suggest: "dsad",
  //       // $select: ["name", "age"],
  //       // name: "sajov"
  //     }
  //   });
  //   // const updatedProduct = await techproducts.update(
  //   //   product.id.toString(),
  //   //   Object.assign(product, { action_s: "update" })
  //   // );
  //   assert.strictEqual(typeof "typeof productNew.id", "string");
  //   // await techproducts.remove(product.id);
  // });

  // it("patch record with prop also in query", async () => {
  //   const techproducts = app.service("techproducts");

  //   // await techproducts.create([
  //   //   {
  //   //     name: "cart",
  //   //     price: 30
  //   //   },
  //   //   {
  //   //     name: "van",
  //   //     price: 10
  //   //   }
  //   // ]);

  //   //   const [updated] = await animals.patch(
  //   //     null,
  //   //     { age: 40 },
  //   //     { query: { age: 30 } }
  //   //   );

  //   //   assert.strictEqual(updated.age, 40);

  //   //   await animals.remove(null, {});
  // });

  // it('allows to pass custom find and sort matcher', async () => {
  //   let sorterCalled = false;
  //   let matcherCalled = false;

  //   app.use(
  //     '/matcher',
  //     solr({
  //       matcher () {
  //         matcherCalled = true;
  //         return function () {
  //           return true;
  //         };
  //       },

  //       sorter () {
  //         sorterCalled = true;
  //         return function () {
  //           return 0;
  //         };
  //       }
  //     })
  //   );

  //   await app.service('matcher').find({
  //     query: { $sort: { something: 1 } }
  //   });

  //   assert.ok(sorterCalled, 'sorter called');
  //   assert.ok(matcherCalled, 'matcher called');
  // });

  // it('does not modify the original data', async () => {
  //   const techproducts = app.service('techproducts');

  //   const person = await techproducts.create({
  //     name: 'Delete tester',
  //     age: 33
  //   });

  //   delete person.age;

  //   const otherPerson = await techproducts.get(person.id);

  //   assert.strictEqual(otherPerson.age, 33);

  //   await techproducts.remove(person.id);
  // });

  // it('does not $select the id', async () => {
  //   const techproducts = app.service('techproducts');
  //   const person = await techproducts.create({
  //     name: 'Tester'
  //   });
  //   const results = await techproducts.find({
  //     query: {
  //       name: 'Tester',
  //       $select: ['name']
  //     }
  //   });

  //   assert.deepStrictEqual(
  //     results[0],
  //     { name: 'Tester' },
  //     'deepEquals the same'
  //   );

  //   await techproducts.remove(person.id);
  // });

  // it('update with null throws error', async () => {
  //   try {
  //     await app.service('techproducts').update(null, {});
  //     throw new Error('Should never get here');
  //   } catch (error) {
  //     assert.strictEqual(
  //       error.message,
  //       "You can not replace multiple instances. Did you mean 'patch'?"
  //     );
  //   }
  // });
});
