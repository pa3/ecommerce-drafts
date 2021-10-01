import { createSlice } from "@reduxjs/toolkit";

interface View {
  current: string;
}

export const view = createSlice({
  name: "view",
  initialState: { current: "initial" } as View,
  reducers: {},
});
