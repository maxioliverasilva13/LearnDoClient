import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import GlobalSlice from "./slices/GlobalSlice";
import ChatsSlice from "./slices/ChatsSlice";

import { UserService } from "./services/UserService";
import { MessageService } from "./services/MessageService";
import { EventoService } from "./services/EventoService";

const store = configureStore({ 
  reducer: {
    GlobalSlice,
    ChatsSlice,
   [UserService.reducerPath]: UserService.reducer,
   [MessageService.reducerPath]: MessageService.reducer,
   [EventoService.reducerPath]: EventoService.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(   
        UserService.middleware,
        MessageService.middleware,
        EventoService.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
