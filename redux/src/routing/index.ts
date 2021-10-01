import { Store } from "redux";
import { RootState } from "@/core/store";
import { actions, canLeave } from "@/core/app";

let currentRouteIndex = 0;
let prevState: RootState;

const getCurrentUrl = () => window.location.pathname + window.location.search;

const goToUrl = (url: string) => {
  console.log("Changing window history to: " + url);
  window.history.pushState({ routeIndex: ++currentRouteIndex }, "", url);
};

const onStoreUpdate = (state: RootState) => {
  if (
    state.app.url !== prevState.app.url &&
    state.app.url !== getCurrentUrl()
  ) {
    goToUrl(state.app.url);
  }
  prevState = state;
};

const confirmLeaving = () =>
  window.confirm(
    "There are unsaved changes. Do you really want to leave this page?"
  );

export const startRouting = (store: Store<RootState>) => {
  let shouldCheckNextPop = true;
  const url = getCurrentUrl();
  store.dispatch(actions.goToUrl(url));
  prevState = store.getState();
  store.subscribe(() => onStoreUpdate(store.getState()));

  window.onbeforeunload = () => !canLeave(store.getState()) && confirmLeaving();

  window.onpopstate = () => {
    if (!shouldCheckNextPop) {
      shouldCheckNextPop = true;
      return;
    }

    const state = window.history.state;
    const routeIndex = state?.routeIndex ?? 0;
    const delta = currentRouteIndex - routeIndex;

    if (!canLeave(store.getState()) && !confirmLeaving()) {
      shouldCheckNextPop = false;
      window.history.go(delta);
    } else {
      currentRouteIndex = routeIndex;
      store.dispatch(actions.goToUrl(getCurrentUrl()));
    }
  };
};
