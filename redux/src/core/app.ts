import {
  createSlice,
  Action,
  PayloadAction,
  ThunkAction,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { Dispatch, RootState } from "@/core/store";
import { getRoute, createView } from "@/core/routes";

type A = Action;

interface App {
  url: string;
  view: ReturnType<typeof createView> | { id: "initial" };
}

//const createView = (url: string) => {
//  const route = getRoute(url);
//
//  if (!route) {
//    return {
//      id: "not-found" as const,
//    };
//  }
//
//  return {
//    id: route.viewId,
//    params: route.getParams(url),
//  };
//};

export const goToUrl =
  (url: string): ThunkAction<void, RootState, void> =>
  (dispatch: Dispatch) => {
    dispatch("lol" + url);
  };

export const canLeave = (state: RootState) =>
  false && state.app.view.id !== "product-list";

export const { reducer, actions } = createSlice({
  name: "app",
  initialState: { url: "/", view: { id: "initial" } } as App,
  reducers: {
    goToUrl(state, action: PayloadAction<string>) {
      const url = action.payload;
      state.url = url;
      state.view = createView(url);
      if (state.view.id === "product") {
        state.view.params.productId;
      }
    },
  },
});
