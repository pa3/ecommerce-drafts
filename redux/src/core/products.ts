import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductType } from "@/core/product-types";
import { ErrorCode } from "@/core/errors";

export type RemoteProduct =
  | {
      status: "loading";
      remoteState?: Product;
    }
  | {
      status: "ready";
      remoteState: Product;
      draft: Partial<Product>;
    }
  | {
      status: "error";
      code: ErrorCode;
      error?: Error;
    };

export type Product = {
  id: string;
  name: string;
  price: number;
  type: ProductType;
  attributes: {
    [id: string]: unknown;
  };
};

export type Products = {
  [id: string]: RemoteProduct;
};

export const isDirty = (state: Products, id: string) => {
  const product = state[id];

  if (product.status !== "ready") return false;

  return !!product.draft;
};

const productsSlice = createSlice({
  name: "products",
  initialState: {} as Products,
  reducers: {
    load(state, action: PayloadAction<string>) {
      const id = action.payload;

      if (state[id]) state[id].status = "loading";
      else state[id] = { status: "loading" };
    },
    handleLoadResult(
      state,
      action: PayloadAction<{ id: string; product: Product }>
    ) {
      const { id, product } = action.payload;
      //      state[id] = product;
    },
  },
});

export const { load, handleLoadResult } = productsSlice.actions;
export const reducer = productsSlice.reducer;
