import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import GlobalSlice from "./slices/GlobalSlice";

import { UserService } from "./services/UserService";

const store = configureStore({
  reducer: {
    GlobalSlice,
   [UserService.reducerPath]: UserService.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
        UserService.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
