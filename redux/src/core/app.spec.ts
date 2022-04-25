import { goToUrl, canLeave } from "@/core/app";
import {
  changeProduct,
  selectProduct,
  handleProductLoadResult,
} from "@/core/products";
import { Constraints } from "@/core/product-list";
import { makeProduct } from "@/fixtures";
import { createStore } from "@/core/store";

describe("core/app", () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  describe("goToUrl", () => {
    it("navigates  to unknown url", () => {
      store.dispatch(goToUrl({ url: "/foo" }));

      expect(store.getState()).toMatchObject({
        app: {
          url: "/foo",
          routeId: undefined,
        },
      });
    });

    it("triggers product loading when navigating to product details", () => {
      store.dispatch(goToUrl({ url: "/product/product-id" }));

      expect(store.getState()).toMatchObject({
        app: {
          url: "/product/product-id",
          routeId: "product",
        },
        products: {
          "product-id": {
            status: "loading",
          },
        },
      });
    });

    it("discards product changes when navigating away from product details", () => {
      const product = makeProduct();
      store.dispatch(goToUrl({ url: `/product/${product.id}` }));
      store.dispatch(handleProductLoadResult({ id: product.id, product }));
      store.dispatch(
        changeProduct({ id: product.id, field: "name", value: "new value" })
      );
      store.dispatch(goToUrl({ url: `/products`, force: true }));

      const productInStore = selectProduct(store.getState(), product.id);
      expect(productInStore).toEqual({
        status: "ready",
        remoteState: product,
        localChanges: {},
      });
    });

    it("triggers product list loading when navigating to product list", () => {
      store.dispatch(goToUrl({ url: "/products" }));

      expect(store.getState()).toMatchObject({
        app: {
          url: "/products",
          routeId: "productList",
        },
        productList: {
          status: "loading",
          itemIds: [],
          constraints: {
            page: 1,
            perPage: 10,
            filters: {},
            sorting: {},
          },
        },
      });
    });

    it("applies initial product list contraints passed in URL", () => {
      const constraints: Constraints = {
        page: 2,
        perPage: 20,
        filters: {
          name: { startsWith: "foo" },
          createdAt: { gt: new Date().toISOString() },
        },
        sorting: { name: "desc", price: "asc" },
      };

      const encodedConstraints = encodeURIComponent(
        JSON.stringify(constraints)
      );

      store.dispatch(
        goToUrl({ url: `/products?constraints=${encodedConstraints}` })
      );

      expect(store.getState()).toMatchObject({
        app: {
          url: `/products?constraints=${encodedConstraints}`,
          routeId: "productList",
        },
        productList: {
          status: "loading",
          itemIds: [],
          constraints,
        },
      });
    });
  });

  describe("canLeave", () => {
    it("lets user leave route which can't be dirty", () => {
      store.dispatch(goToUrl({ url: "/foo" }));

      expect(canLeave(store.getState())).toBe(true);
    });

    it("lets user leave product route if product is not dirty", () => {
      store.dispatch(goToUrl({ url: "/product/product-id" }));

      expect(canLeave(store.getState())).toBe(true);
    });

    it("doesn't let user leave product state if product is dirty", () => {
      const product = makeProduct();
      store.dispatch(goToUrl({ url: `/product/${product.id}` }));
      store.dispatch(handleProductLoadResult({ id: product.id, product }));
      store.dispatch(
        changeProduct({ id: product.id, field: "name", value: "new name" })
      );

      expect(canLeave(store.getState())).toBe(false);
    });
  });
});
