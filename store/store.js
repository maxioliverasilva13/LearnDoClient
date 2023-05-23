import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import GlobalSlice from "./slices/GlobalSlice";
import ChatsSlice from "./slices/ChatsSlice";

import { UserService } from "./services/UserService";
import { MessageService } from "./services/MessageService";
import { EventoService } from "./services/EventoService";
import { CategoriaService } from "./services/CategoriaService";

const store = configureStore({ 
  reducer: {
    GlobalSlice,
    ChatsSlice,
   [UserService.reducerPath]: UserService.reducer,
   [MessageService.reducerPath]: MessageService.reducer,
   [EventoService.reducerPath]: EventoService.reducer,
   [CategoriaService.reducerPath]: CategoriaService.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(   
        UserService.middleware,
        MessageService.middleware,
        EventoService.middleware,
        CategoriaService.middleware,
    ),
});

setupListeners(store.dispatch);

export default store;
