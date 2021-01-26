const assert = require("assert");
const proxyquire = require("proxyquire");

const { MongoLibMock, getAllStub, createStub } = require("../store/mongoLib");
const { productsMock, filteredProductsMock } = require("../store/dummydb");

describe("services - products", function () {
  const ProductService = proxyquire("../services/product", {
    "../lib/mongo": MongoLibMock,
  });
  const productsService = new ProductService();

  describe("when getProducts is called", async function () {
    it("should call the getAll MongoLib method", async function () {
      await productsService.getProducts({});
      assert.strictEqual(getAllStub.called, true);
    });

    it("should return an array of products", async function () {
      const result = await productsService.getProducts({});
      const expected = productsMock;
      assert.deepStrictEqual(result, expected);
    });
  });

  describe("when getProducts method is called with tags", async function () {
    it("should all the getAll MongoLib method with tags args", async function () {
      await productsService.getProducts({ tags: ["expensive"] });
      const tagQuery = { tags: { $in: ["expensive"] } };
      assert.strictEqual(getAllStub.calledWith("products", tagQuery), true);
    });

    it("should return an array of products filtered by the tag", async function () {
      const result = await productsService.getProducts({ tags: ["expensive"] });
      const expected = filteredProductsMock("expensive");
      assert.deepStrictEqual(result, expected);
    });
  });
});
