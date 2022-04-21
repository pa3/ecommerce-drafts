import {
  loadProduct,
  handleProductLoadResult,
  changeProduct,
  isDirty,
  selectProduct,
} from "@/core/products";
import { handleProductListLoadResult } from "@/core/product-list";
import { makeProduct } from "@/fixtures";
import { createStore } from "@/core/store";

let store: ReturnType<typeof createStore>;

describe("core/products", () => {
  beforeEach(() => {
    store = createStore();
  });

  describe("isDirty", () => {
    const product = makeProduct();

    it("counts product out of sync status as being clean", () => {
      store.dispatch(loadProduct(product.id));
      const { products } = store.getState();
      expect(isDirty(products, product.id)).toBe(false);
    });

    it("counts product without local changes as being clean", () => {
      store.dispatch(handleProductLoadResult({ id: product.id, product }));
      const { products } = store.getState();
      expect(isDirty(products, product.id)).toBe(false);
    });

    it("counts product with local changes as being dirty", () => {
      store.dispatch(handleProductLoadResult({ id: product.id, product }));
      store.dispatch(
        changeProduct({
          id: product.id,
          field: "name",
          value: "new product name",
        })
      );

      const { products } = store.getState();
      expect(isDirty(products, product.id)).toBe(true);
    });
  });

  describe("loadProduct", () => {
    it("triggers product loading of a product which was not loaded yet", () => {
      store.dispatch(loadProduct("productId"));

      const product = selectProduct(store.getState(), "productId");
      expect(product).toEqual({
        status: "loading",
      });
    });

    it("triggers product loading of previously loaded product", () => {
      const product = makeProduct();
      store.dispatch(handleProductLoadResult({ id: product.id, product }));
      store.dispatch(loadProduct(product.id));

      const productInStore = selectProduct(store.getState(), product.id);
      expect(productInStore).toMatchObject({
        status: "loading",
      });
    });
  });

  describe("handleProductLoadResult", () => {
    const product = makeProduct();

    it("switches pending product status from 'loading' to 'ready'", () => {
      store.dispatch(loadProduct(product.id));
      store.dispatch(handleProductLoadResult({ id: product.id, product }));

      const productInStore = selectProduct(store.getState(), product.id);
      expect(productInStore).toEqual({
        status: "ready",
        remoteState: product,
        localChanges: {},
      });
    });

    it("stores successfully loaded product even if it did not present with 'loading' status", () => {
      const product = makeProduct();
      store.dispatch(handleProductLoadResult({ id: product.id, product }));

      const productInStore = selectProduct(store.getState(), product.id);
      expect(productInStore).toEqual({
        status: "ready",
        remoteState: product,
        localChanges: {},
      });
    });

    it("doesn't drop local changes", () => {
      const product = makeProduct();
      store.dispatch(handleProductLoadResult({ id: product.id, product }));
      store.dispatch(
        changeProduct({
          id: product.id,
          field: "name",
          value: "new product name",
        })
      );
      store.dispatch(handleProductLoadResult({ id: product.id, product }));

      const productInStore = selectProduct(store.getState(), product.id);
      expect(productInStore).toMatchObject({
        localChanges: { name: "new product name" },
      });
    });

    it("stores loading error", () => {
      store.dispatch(
        handleProductLoadResult({ id: "productId", error: "not-found" })
      );

      const productInStore = selectProduct(store.getState(), "productId");
      expect(productInStore).toEqual({
        status: "loading-error",
        error: "not-found",
      });
    });
  });

  describe("changeProduct", () => {
    const product = makeProduct({ name: "original product name" });

    beforeEach(() => {
      store.dispatch(handleProductLoadResult({ id: product.id, product }));
    });

    it("changes product name", () => {
      store.dispatch(
        changeProduct({
          id: product.id,
          field: "name",
          value: "new product name",
        })
      );

      const productInStore = selectProduct(store.getState(), product.id);
      expect(productInStore).toMatchObject({
        localChanges: { name: "new product name" },
      });
    });

    it("drops localChanges when product field changes reverted", () => {
      store.dispatch(
        changeProduct({
          id: product.id,
          field: "name",
          value: "new product name",
        })
      );

      store.dispatch(
        changeProduct({
          id: product.id,
          field: "name",
          value: "original product name",
        })
      );

      const productInStore = selectProduct(store.getState(), product.id);
      expect(productInStore.localChanges).toEqual({});
    });
  });

  describe("handleProductListLoadResult", () => {
    it("stores loaded list item details", () => {
      const product1 = makeProduct();
      const product2 = makeProduct();

      store.dispatch(
        handleProductListLoadResult({ total: 100, items: [product1, product2] })
      );

      const { products } = store.getState();

      expect(products).toEqual({
        [product1.id]: {
          status: "ready",
          remoteState: product1,
          localChanges: {},
        },
        [product2.id]: {
          status: "ready",
          remoteState: product2,
          localChanges: {},
        },
      });
    });
  });
});
