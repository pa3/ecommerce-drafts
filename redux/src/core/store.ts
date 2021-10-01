import {
  AnyAction,
  combineReducers,
  configureStore,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import { reducer as appReducer } from "@/core/app";

const reducer = combineReducers({ app: appReducer });

export const createStore = () =>
  configureStore({
    reducer,
  });

export type RootState = ReturnType<typeof reducer>;

export type Dispatch = ThunkDispatch<RootState, void, AnyAction>;
