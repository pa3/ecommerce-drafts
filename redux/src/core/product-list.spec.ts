import {
  applyConstraints,
  handleProductListLoadResult,
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
          sorting: [],
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
          sorting: [],
        },
        total: 100,
        itemIds: [product1.id, product2.id],
      });
    });
  });
});
