import { applyConstraints, handleProductListLoadResult, sortBy, goToPage, setPageSize, selectSorting, selectPagination } from "@/core/product-list";
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
      const sorting = selectSorting(store.getState());
      expect(sorting).toEqual({ name: "asc" });
    });

    it("allows sorting by multiple columns", () => {
      store.dispatch(sortBy("name"));
      store.dispatch(sortBy("price"));
      const sorting = selectSorting(store.getState());
      expect(sorting).toEqual({
        name: "asc",
        price: "asc",
      });
    });

    it("toggles existing ASC sorting to DESC", () => {
      store.dispatch(sortBy("name"));
      store.dispatch(sortBy("name"));
      const sorting = selectSorting(store.getState());
      expect(sorting).toEqual({ name: "desc" });
    });

    it("clears sorting on field if it was of DESC order", () => {
      store.dispatch(sortBy("name"));
      store.dispatch(sortBy("price"));
      store.dispatch(sortBy("name"));
      store.dispatch(sortBy("name"));
      const sorting = selectSorting(store.getState());
      expect(sorting).toEqual({ price: "asc" });
    });

    it("should put list into loading state", () => {
      store.dispatch(sortBy("name"));
      const { status } = store.getState().productList;
      expect(status).toBe("loading");
    });
  });

  describe("goToPage", () => {
    it("should apply new page number to constraints", () => {
      store.dispatch(goToPage(3));
      const { constraints } = store.getState().productList;
      expect(constraints.page).toBe(3);
    });
  });

  describe("goToPage", () => {
    it("should apply new page number to the constraints", () => {
      store.dispatch(goToPage(3));
      const { page } = selectPagination(store.getState());
      expect(page).toBe(3);
    });

    it("should put list into loading state", () => {
      store.dispatch(goToPage(3));
      const { status } = store.getState().productList;
      expect(status).toBe("loading");
    });
  });

  describe("setPageSize", () => {
    it("should apply new page size to the constraints", () => {
      store.dispatch(setPageSize(20));
      const { perPage } = selectPagination(store.getState());
      expect(perPage).toBe(20);
    });

    it("should go to the first page", () => {
      store.dispatch(goToPage(3));
      store.dispatch(setPageSize(20));
      const { page } = selectPagination(store.getState());
      expect(page).toBe(1);
    });

    it("should put list into loading state", () => {
      store.dispatch(setPageSize(20));
      const { status } = store.getState().productList;
      expect(status).toBe("loading");
    });

    it("should update total pages count", () => {
      store.dispatch(handleProductListLoadResult({ total: 100, items: [makeProduct(), makeProduct()] }));
      expect(selectPagination(store.getState()).totalPages).toBe(10);
      store.dispatch(setPageSize(20));
      expect(selectPagination(store.getState()).totalPages).toBe(5);
    });
  });
});
