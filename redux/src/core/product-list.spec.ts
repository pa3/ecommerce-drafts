import { applyConstraints, reducer, ProductList } from "@/core/product-list";

let state: ProductList;

describe("Product List", () => {
  beforeEach(() => {
    state = {
      status: "ready",
      constraints: {
        page: 1,
        perPage: 10,
        filters: {},
        sorting: [],
      },
      itemIds: [],
    };
  });
  describe("applyConstraints", () => {
    it("should start loading page with new constraints", () => {
      state = reducer(state, applyConstraints({ page: 2 }));

      expect(state).toEqual({
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
});
