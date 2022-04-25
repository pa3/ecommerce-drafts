import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/core/products";
import { assignDeep, DeepPartial } from "@/core/utils";

type TextFilter =
  | {
      startsWith: string;
    }
  | {
      eq: string;
    };

type NumericFilter =
  | {
      eq: number;
    }
  | {
      gt: number;
      lt?: number;
    }
  | {
      gt?: number;
      lt: number;
    };

type DateFilter =
  | {
      eq: string;
    }
  | {
      gt: string;
      lt?: string;
    }
  | {
      gt?: string;
      lt: string;
    };

type ReferenceFilter = {
  id: string;
};

export type Constraints = {
  page: number;
  perPage: number;
  filters: {
    name?: TextFilter;
    price?: NumericFilter;
    createdAt?: DateFilter;
    productType?: ReferenceFilter;
  };
  sorting: {
    [by: string]: "asc" | "desc";
  };
};

export type ProductList = {
  status: "loading" | "ready" | "error";
  constraints: Constraints;
  itemIds: string[];
  total?: number;
};

const DEFAULT_CONSTRAINTS = {
  page: 1,
  perPage: 10,
  filters: {},
  sorting: {},
};

const productListSlice = createSlice({
  name: "productList",
  initialState: {
    status: "ready",
    constraints: DEFAULT_CONSTRAINTS,
    itemIds: [],
  } as ProductList,
  reducers: {
    applyConstraints(
      state: ProductList,
      action: PayloadAction<DeepPartial<Constraints> | undefined>
    ) {
      const constraints = action.payload ?? {};
      state.constraints = assignDeep(state.constraints, constraints);
      state.status = "loading";
    },
    handleProductListLoadResult(
      state: ProductList,
      action: PayloadAction<{
        total: number;
        items: Product[];
      }>
    ) {
      const { total, items } = action.payload;
      state.status = "ready";
      state.total = total;
      state.itemIds = items.map(({ id }) => id);
    },
    sortBy(state: ProductList, action: PayloadAction<string>) {
      const by = action.payload;
      const prevOrder = state.constraints.sorting[by];
      if (prevOrder === "desc") {
        delete state.constraints.sorting[by];
      } else {
        const newOrder = prevOrder ? "desc" : "asc";
        state.constraints.sorting[by] = newOrder;
      }
    },
  },
});

export const { applyConstraints, handleProductListLoadResult, sortBy } =
  productListSlice.actions;
export const reducer = productListSlice.reducer;