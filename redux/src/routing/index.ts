import { Store } from "redux";
import { RootState } from "@/core/store";
import { actions, canLeave } from "@/core/app";

let currentRouteIndex = 0;

const getCurrentUrl = () => window.location.pathname + window.location.search;

const goToUrl = (url: string) => {
  window.history.pushState({ routeIndex: ++currentRouteIndex }, "", url);
};

const confirmLeaving = () =>
  window.confirm(
    "There are unsaved changes. Do you really want to leave this page?"
  );

export const startRouting = (store: Store<RootState>) => {
  const onStoreUpdate = (state: RootState) => {
    if (state.app.url !== getCurrentUrl()) {
      goToUrl(state.app.url);
    }

    if (state.app.nextUrl) {
      confirmLeaving() &&
        store.dispatch(
          actions.goToUrl({ url: state.app.nextUrl, force: true })
        );
    }
  };

  let shouldCheckNextPop = true;
  store.dispatch(actions.goToUrl({ url: getCurrentUrl() }));
  store.subscribe(() => onStoreUpdate(store.getState()));

  window.onbeforeunload = (event) => {
    if (!canLeave(store.getState().app)) {
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

    if (!canLeave(store.getState().app) && !confirmLeaving()) {
      shouldCheckNextPop = false;
      window.history.go(delta);
    } else {
      currentRouteIndex = routeIndex;
      store.dispatch(actions.goToUrl({ url: getCurrentUrl() }));
    }
  };
};
