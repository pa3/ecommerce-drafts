import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/core/store";
import { createView } from "@/core/routes";

interface App {
  url: string;
  view: ReturnType<typeof createView> | { id: "initial" };
}

export const canLeave = (_: RootState) => false;

export const { reducer, actions } = createSlice({
  name: "app",
  initialState: { url: "/", view: { id: "initial" } } as App,
  reducers: {
    goToUrl(state, action: PayloadAction<string>) {
      const url = action.payload;
      state.url = url;
      state.view = createView(url);
    },
  },
});
