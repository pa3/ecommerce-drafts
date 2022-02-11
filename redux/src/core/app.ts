import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeRoute, findMatchingRoute } from "@/core/routes";

type AppRoute = typeof routes[keyof typeof routes];
type View = ReturnType<typeof createView>;

type App = {
  url: string;
  nextUrl?: string;
  view: View;
};

export const routes = {
  root: makeRoute("/"),
  product: makeRoute<{ productId: string }>("/product/:productId"),
  productList: makeRoute("/products"),
};

function createView(route: AppRoute | undefined, url: string) {
  switch (route) {
    case routes.root:
      return { id: "root" as const };
    case routes.product:
      return {
        id: "product" as const,
        productId: route.getParams(url).productId,
      };
    case routes.productList:
      return { id: "product-list" as const };
  }
  return { id: "not-found" as const };
}

export function getViewUrl(view: View): string | undefined {
  switch (view.id) {
    case "root":
      return routes.root.getUrl();
    case "product-list":
      return routes.productList.getUrl();
    case "product":
      return routes.product.getUrl({ productId: view.productId });
    default:
      return undefined;
  }
}

export const canLeave = (app: App) => {
  return app.view.id !== "product";
};

export const { reducer, actions } = createSlice({
  name: "app",
  initialState: {
    url: "/",
    view: { id: "root", params: undefined },
  } as App,
  reducers: {
    goToUrl(state, action: PayloadAction<{ url: string; force?: boolean }>) {
      const { url, force } = action.payload;

      if (!force && !canLeave(state)) {
        state.nextUrl = url;
        return;
      }

      const route = findMatchingRoute(Object.values(routes), url);
      const view = createView(route, url);
      state.view = view;
      state.url = url;
      state.nextUrl = undefined;
    },
  },
});
