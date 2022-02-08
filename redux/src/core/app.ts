import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createView } from "@/core/routes";

interface App {
  nextView?: ReturnType<typeof createView>;
  view: ReturnType<typeof createView>;
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
    goTo(state, action: PayloadAction<{ view: App["view"]; force?: boolean }>) {
      const { view, force } = action.payload;
      if (!force && !canLeave(state)) {
        state.nextView = view;
      } else {
        state.view = view;
        state.nextView = undefined;
      }
    },
  },
});
