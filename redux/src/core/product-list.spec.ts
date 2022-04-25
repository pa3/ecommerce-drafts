import {
  applyConstraints,
  handleProductListLoadResult,
  sortBy,
} from "@/core/product-list";
import { makeProduct } from "@/fixtures";
import { createStore } from "@/core/store";

describe("Product List", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe("applyConstraints", () => {
    it("should start loading page with new constraints", () => {
      store.dispatch(applyConstraints({ page: 2 }));

      expect(store.getState().productList).toEqual({
        status: "loading",
        constraints: {
          page: 2,
          perPage: 10,
          filters: {},
          sorting: {},
        },
        itemIds: [],
      });
    });
  });

  describe("handleProductListLoadResult", () => {
    it("should start loading page with new constraints", () => {
      const product1 = makeProduct();
      const product2 = makeProduct();

      store.dispatch(applyConstraints({ page: 2 }));
      store.dispatch(
        handleProductListLoadResult({
          total: 100,
          items: [product1, product2],
        })
      );

      const { productList } = store.getState();

      expect(productList).toEqual({
        status: "ready",
        constraints: {
          page: 2,
          perPage: 10,
          filters: {},
          sorting: {},
        },
        total: 100,
        itemIds: [product1.id, product2.id],
      });
    });
  });

  describe("sortBy", () => {
    it("apply ASC sorting initially", () => {
      store.dispatch(sortBy("name"));
      const { sorting } = store.getState().productList.constraints;
      expect(sorting).toEqual({ name: "asc" });
    });

    it("allows sorting by multiple columns", () => {
      store.dispatch(sortBy("name"));
      store.dispatch(sortBy("price"));
      const { sorting } = store.getState().productList.constraints;
      expect(sorting).toEqual({
        name: "asc",
        price: "asc",
      });
    });

    it("toggles existing ASC sorting to DESC", () => {
      store.dispatch(sortBy("name"));
      store.dispatch(sortBy("name"));
      const { sorting } = store.getState().productList.constraints;
      expect(sorting).toEqual({ name: "desc" });
    });

    it("clears sorting on field if it was of DESC order", () => {
      store.dispatch(sortBy("name"));
      store.dispatch(sortBy("price"));
      store.dispatch(sortBy("name"));
      store.dispatch(sortBy("name"));
      const { sorting } = store.getState().productList.constraints;
      expect(sorting).toEqual({ price: "asc" });
    });
  });
});
