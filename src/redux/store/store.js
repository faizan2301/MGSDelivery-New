import { configureStore, combineReducers } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../api/api";
import userData from "../slice/authSlice";
import tokenSlice from "../slice/tokenSlice";
import cameraPermissionSlice from "../slice/cameraPermissionSlice";
const reducer = combineReducers({
  user: userData,
  token: tokenSlice,
  cameraPermission: cameraPermissionSlice,
});
export const store = configureStore({
  reducer: {
    user: userData,
    token: tokenSlice,
    cameraPermission: cameraPermissionSlice,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: { warnAfter: 128 },
    }).concat(api.middleware),
});
//pokemonApi.middleware,
// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
