import { AnyAction, combineReducers, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { reducer as appReducer } from "@/core/app";
import { reducer as productsReducer } from "@/core/products";
import { reducer as productListReducer } from "@/core/product-list";

const reducer = combineReducers({
  app: appReducer,
  products: productsReducer,
  productList: productListReducer,
});

export function createStore() {
  return configureStore({
    reducer,
  });
}

export type RootState = ReturnType<typeof reducer>;

export type Dispatch = ThunkDispatch<RootState, void, AnyAction>;

export type Store = ReturnType<typeof createStore>;

export type GetState = () => RootState;
