import { RootState, Store } from "@/core/store";
import { handleProductLoadResult } from "@/core/products";

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
    if (!ids.length) return;

    ids.forEach(async (id) => {
      pending[id] = true;
      const product = await fetchProduct(id);
      store.dispatch(handleProductLoadResult({ id, product }));
      pending[id] = false;
    });
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
