import { RootState, Store } from "@/core/store";
import { handleLoadResults } from "@/core/products";

const fetchProduct = async (id: string) => {
  const response = await fetch(`/api/products/${id}`);
  return response.json();
};

export const startNetwork = (store: Store) => {
  let prevState = store.getState().products;

  const pending: Record<string, boolean> = {};

  const getProductsToLoad = (state: RootState) =>
    Object.entries(state.products)
      .filter(
        ([productId, { status }]) => status === "loading" && !pending[productId]
      )
      .map(([id]) => id);

  const loadProducts = async (ids: string[]) => {
    const promises = ids.map(async (id) => {
      pending[id] = true;
      const product = await fetchProduct(id);
      pending[id] = false;

      return product;
    });

    const products = await Promise.all(promises);

    const results = products.map((product) => ({ id: product.id, product }));

    store.dispatch(handleLoadResults(results));
  };

  const onStoreUpdate = (state: RootState) => {
    if (prevState != state.products) {
      const productsToLoad = getProductsToLoad(state);
      loadProducts(productsToLoad);
      prevState = state.products;
    }
  };

  store.subscribe(() => onStoreUpdate(store.getState()));
};
