import { createSlice, createSelector, PayloadAction, Draft } from "@reduxjs/toolkit";
import { handleProductListLoadResult } from "@/core/product-list";
import { ProductType } from "@/core/product-types";
import { RemoteEntity, SyncingError } from "@/core/remote-entity";
import { RootState } from "@/core/store";

export type Product = {
  id: string;
  name: string;
  price: number;
  type: ProductType;
  attributes: {
    [id: string]: unknown;
  };
};

export type Products = { [id: string]: RemoteEntity<Product> };

type HandleProductLoadResultPayload = { id: string; error: SyncingError } | { id: string; product: Product };

export const isDirty = (state: Products, id: string) => {
  const product = state[id];

  if (product.status !== "ready") return false;

  return Object.keys(product.localChanges || {}).length > 0;
};

const productsSlice = createSlice({
  name: "products",
  initialState: {} as Products,
  reducers: {
    loadProduct(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (state[id]) {
        state[id].status = "loading";
      } else {
        state[id] = { status: "loading" };
      }
    },

    handleProductLoadResult(state, action: PayloadAction<HandleProductLoadResultPayload>) {
      const result = action.payload;

      if ("error" in result) {
        state[result.id] = {
          status: "loading-error",
          error: result.error,
          remoteState: state[result.id]?.remoteState,
        };
      } else {
        state[result.id] = {
          status: "ready",
          remoteState: result.product,
          localChanges: state[result.id]?.localChanges || {},
        };
      }
    },

    changeProduct<T extends keyof Product>(state: Draft<Products>, action: PayloadAction<{ id: string; field: T; value: Product[T] }>) {
      const { id, field, value } = action.payload;
      const product = state[id];

      if (product.status !== "ready") return;

      if (product.remoteState[field] === value) {
        delete product.localChanges[field];
        return;
      }

      product.localChanges[field] = value;
    },

    discardChanges(state, action: PayloadAction<string>) {
      const id = action.payload;
      const product = state[id];
      product.localChanges = {};
    },
  },

  extraReducers: (builder) => {
    builder.addCase(handleProductListLoadResult, (state, action) => {
      const { items } = action.payload;
      items.forEach((item) => {
        state[item.id] = {
          status: "ready",
          remoteState: item,
          localChanges: {},
        };
      });
    });
  },
});

const selectSelf = (state: RootState) => state.products;

export const selectProduct = createSelector([selectSelf, (_: RootState, id: string) => id], (state: Products, id: string) => state[id]);

// Overriding `changeProduct` type to prevent loosing dependency between
// types of `field` and `value`.
export const { loadProduct, handleProductLoadResult, discardChanges, changeProduct } = productsSlice.actions as unknown as Omit<
  typeof productsSlice.actions,
  "changeProduct"
> & {
  changeProduct: <T extends keyof Product>(payload: { id: string; field: T; value: Product[T] }) => PayloadAction<{ id: string; field: T; value: Product[T] }>;
};
export const reducer = productsSlice.reducer;
