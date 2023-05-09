import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import GlobalSlice from "./slices/GlobalSlice";
import ChatsSlice from "./slices/ChatsSlice";

import { UserService } from "./services/UserService";
import { MessageService } from "./services/MessageService";

const store = configureStore({
  reducer: {
    GlobalSlice,
    ChatsSlice,
   [UserService.reducerPath]: UserService.reducer,
   [MessageService.reducerPath]: MessageService.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
        UserService.middleware,
        MessageService.middleware,
    ),
});

setupListeners(store.dispatch);

export default store;
