import { RootState, Store } from "@/core/store";
import { handleProductListLoadResult, Constraints } from "@/core/product-list";

export const startProductListSyncing = (store: Store) => {
  let prevConstraints = store.getState().productList.constraints;

  const loadProductsForConstraints = async (constraints: Constraints) => {
    prevConstraints = constraints;
    const response = await fetch(`/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(constraints),
    });
    const loadedProducts = await response.json();
    if (prevConstraints === constraints) {
      console.log({ loadedProducts });
      store.dispatch(handleProductListLoadResult(loadedProducts));
    }
  };

  const onStoreUpdate = (state: RootState) => {
    if (prevConstraints != state.productList.constraints) {
      const constraints = state.productList.constraints;
      loadProductsForConstraints(constraints);
    }
  };

  store.subscribe(() => onStoreUpdate(store.getState()));
};
