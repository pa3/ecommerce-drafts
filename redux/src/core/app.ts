import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeRoute, findMatchingRoute } from "@/core/routes";
import { loadProduct } from "@/core/products";
import { RootState, Dispatch, GetState } from "@/core/store";

type AppRouteId = keyof typeof routes;

type App = {
  url: string;
  nextUrl?: string;
  routeId: AppRouteId;
};

export const routes = {
  root: makeRoute("/"),
  product: makeRoute<{ productId: string }>("/product/:productId"),
  productList: makeRoute("/products"),
};

const routeIdByRoute = Object.entries(routes).reduce(
  (result, [routeId, route]) => result.set(route, routeId),
  new Map()
);

export const canLeave = (state: RootState) => {
  if (state.app.routeId === "product") {
    return true;
  }
  return true;
};

const appSlice = createSlice({
  name: "app",
  initialState: {
    url: "/",
    routeId: "root",
  } as App,
  reducers: {
    confirmGoTo(state, action: PayloadAction<string>) {
      const url = action.payload;
      state.nextUrl = url;
    },
    setCurrentRoute(
      state,
      action: PayloadAction<{ url: string; routeId: keyof typeof routes }>
    ) {
      const { url, routeId } = action.payload;
      state.url = url;
      state.routeId = routeId;
      delete state.nextUrl;
    },
  },
});

export const { setCurrentRoute, confirmGoTo } = appSlice.actions;
export const reducer = appSlice.reducer;

export const goToUrl =
  (payload: { url: string; force?: boolean }) =>
  (dispatch: Dispatch, getState: GetState) => {
    const { url, force } = payload;

    const state = getState();

    if (!force && !canLeave(state)) {
      dispatch(confirmGoTo(url));
      return;
    }

    const route = findMatchingRoute(Object.values(routes), url);

    if (route === routes.product) {
      const { productId } = route.getParams(url);
      dispatch(loadProduct(productId));
    }

    dispatch(setCurrentRoute({ routeId: routeIdByRoute.get(route), url }));
  };
