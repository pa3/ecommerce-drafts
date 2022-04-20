import {
  loadProduct,
  handleProductLoadResult,
  changeProduct,
  isDirty,
  reducer,
  Products,
} from "@/core/products";
import { makeProduct } from "@/fixtures";

let state: Products = {};

describe("core/products", () => {
  beforeEach(() => {
    state = {};
  });

  describe("isDirty", () => {
    const product = makeProduct();

    it("counts product out of sync status as being clean", () => {
      state = {
        [product.id]: {
          status: "loading",
        },
      };

      expect(isDirty(state, product.id)).toBe(false);
    });

    it("counts product without local changes as being clean", () => {
      state = {
        [product.id]: {
          status: "ready",
          remoteState: product,
          localChanges: {},
        },
      };

      expect(isDirty(state, product.id)).toBe(false);
    });

    it("counts product with local changes as being dirty", () => {
      state = {
        [product.id]: {
          status: "ready",
          remoteState: product,
          localChanges: { name: "new product name" },
        },
      };

      expect(isDirty(state, product.id)).toBe(true);
    });
  });

  describe("loadProduct", () => {
    it("triggers product loading of a product which was not loaded yet", () => {
      state = reducer(state, loadProduct("productId"));

      expect(state).toEqual({
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
        localChanges: { name: "new value" },
      };

      state = reducer(state, loadProduct(product.id));

      expect(state).toEqual({
        [product.id]: {
          status: "loading",
          remoteState: product,
          localChanges: { name: "new value" },
        },
      });
    });
  });

  describe("handleProductLoadResult", () => {
    const product = makeProduct();

    it("switches pending product status from 'loading' to 'ready'", () => {
      state = reducer(state, loadProduct(product.id));
      state = reducer(
        state,
        handleProductLoadResult({ id: product.id, product })
      );

      expect(state).toEqual({
        [product.id]: {
          status: "ready",
          remoteState: product,
          localChanges: {},
        },
      });
    });

    it("stores successfully loaded product even if it did not present with 'loading' status", () => {
      const product1 = makeProduct();

      state = reducer(
        state,
        handleProductLoadResult({ id: product1.id, product: product1 })
      );

      expect(state).toEqual({
        [product1.id]: {
          status: "ready",
          remoteState: product1,
          localChanges: {},
        },
      });
    });

    it("doesn't drop local changes", () => {
      const product = makeProduct();
      state = {
        [product.id]: {
          status: "ready",
          remoteState: product,
          localChanges: { name: "new name" },
        },
      };

      state = reducer(
        state,
        handleProductLoadResult({ id: product.id, product })
      );

      expect(state[product.id].localChanges).toEqual({ name: "new name" });
    });

    it("stores loading error", () => {
      state = reducer(
        state,
        handleProductLoadResult({ id: "productId", error: "not-found" })
      );

      expect(state).toEqual({
        productId: {
          status: "loading-error",
          error: "not-found",
        },
      });
    });
  });

  describe("changeProduct", () => {
    const product = makeProduct({ name: "original product name" });

    beforeEach(() => {
      state = {
        [product.id]: {
          status: "ready",
          remoteState: product,
          localChanges: {},
        },
      };
    });

    it("changes product name", () => {
      state = reducer(
        state,
        changeProduct({
          id: product.id,
          field: "name",
          value: "new product name",
        })
      );

      expect(state[product.id].localChanges).toEqual({
        name: "new product name",
      });
    });

    it("drops localChanges when product field changes reverted", () => {
      state = reducer(
        state,
        changeProduct({
          id: product.id,
          field: "name",
          value: "new product name",
        })
      );

      state = reducer(
        state,
        changeProduct({
          id: product.id,
          field: "name",
          value: "original product name",
        })
      );

      expect(state[product.id].localChanges).toEqual({});
    });
  });
});
