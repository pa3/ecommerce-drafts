import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeRoute, findMatchingRoute } from "@/core/routes";

interface App {
  nextView?: ReturnType<typeof createView>;
  view: ReturnType<typeof createView>;
}

type AppRoute = typeof routes[keyof typeof routes];

export const views = {
  notFound: { id: "not-found" },
};

export const routes = {
  root: makeRoute("/"),
  product: makeRoute<{ productId: string }>("/product/:productId"),
  productList: makeRoute("/products"),
};

export function createView(route: AppRoute | undefined, url: string) {
  switch (route) {
    case routes.root:
      return { id: "root" };
    case routes.product:
      return { id: "product", productId: route.getParams(url).productId };
    case routes.productList:
      return { id: "product-list" };
  }
  return { id: "not-found" };
}

export const canLeave = (app: App) => {
  return app.view.id !== "product";
};

export const { reducer, actions } = createSlice({
  name: "app",
  initialState: {
    view: { id: "root", params: undefined },
  } as App,
  reducers: {
    goToUrl(state, action: PayloadAction<{ url: string; force?: boolean }>) {
      const { url, force } = action.payload;
      const route = findMatchingRoute(Object.values(routes), url);
      const view = createView(route, url);

      if (!force && !canLeave(state)) {
        state.nextView = view;
      } else {
        state.view = view;
        state.nextView = undefined;
      }
    },
  },
});
