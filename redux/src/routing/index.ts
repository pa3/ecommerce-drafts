import { RootState, Store } from "@/core/store";
import { goToUrl, canLeave } from "@/core/app";

let currentRouteIndex = 0;

const getCurrentUrl = () => window.location.pathname + window.location.search;

const setUrl = (url: string) => {
  window.history.pushState({ routeIndex: ++currentRouteIndex }, "", url);
};

const confirmLeaving = () =>
  window.confirm(
    "There are unsaved changes. Do you really want to leave this page?"
  );

export const startRouting = (store: Store) => {
  const onStoreUpdate = (state: RootState) => {
    if (state.app.url !== getCurrentUrl()) {
      setUrl(state.app.url);
    }

    if (state.app.nextUrl) {
      confirmLeaving() &&
        store.dispatch(goToUrl({ url: state.app.nextUrl, force: true }));
    }
  };

  let shouldCheckNextPop = true;
  store.dispatch(goToUrl({ url: getCurrentUrl() }));
  store.subscribe(() => onStoreUpdate(store.getState()));

  window.onbeforeunload = (event) => {
    if (!canLeave(store.getState())) {
      event.preventDefault();
      event.returnValue = "";
    }
  };

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
      store.dispatch(goToUrl({ url: getCurrentUrl() }));
    }
  };
};
