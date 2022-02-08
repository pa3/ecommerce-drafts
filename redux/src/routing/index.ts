import { Store } from "redux";
import { RootState } from "@/core/store";
import { actions, canLeave } from "@/core/app";
import { getUrl, createView } from "@/core/routes";

let currentRouteIndex = 0;
let prevState: RootState;

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
    if (state.app.view !== prevState.app.view) {
      const nextUrl = getUrl(state.app.view);
      if (nextUrl !== getCurrentUrl()) goToUrl(nextUrl);
    }
    if (state.app.nextView) {
      confirmLeaving() &&
        store.dispatch(actions.goTo({ view: state.app.nextView, force: true }));
    }
    prevState = state;
  };

  let shouldCheckNextPop = true;
  const view = createView(getCurrentUrl());
  store.dispatch(actions.goTo({ view }));
  prevState = store.getState();
  store.subscribe(() => onStoreUpdate(store.getState()));

  window.onbeforeunload = () =>
    !canLeave(store.getState().app) && confirmLeaving();

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
      const view = createView(getCurrentUrl());
      store.dispatch(actions.goTo({ view }));
    }
  };
};
