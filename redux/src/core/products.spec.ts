import { load, reducer, Products } from "@/core/products";
import { makeProduct } from "@/fixtures";

let state: Products = {};

describe("Products", () => {
  beforeEach(() => {
    state = {};
  });

  describe("load", () => {
    it("triggers product loading of a product which was not loaded yet", () => {
      const nextState = reducer(state, load("productId"));

      expect(nextState).toEqual({
        productId: {
          status: "loading",
        },
      });
    });

    it("triggers product loading of previously loaded product", () => {
      const product = makeProduct();

      state[product.id] = {
        status: "ready",
        remoteState: product,
        draft: {},
      };

      const nextState = reducer(state, load(product.id));

      expect(nextState).toEqual({
        [product.id]: {
          status: "loading",
          remoteState: product,
          draft: {},
        },
      });
    });
  });
});
