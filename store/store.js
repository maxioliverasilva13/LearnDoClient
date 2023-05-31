import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import GlobalSlice from "./slices/GlobalSlice";
import ChatsSlice from "./slices/ChatsSlice";

import { UserService } from "./services/UserService";
import { MessageService } from "./services/MessageService";
import { EventoService } from "./services/EventoService";
import { CategoriaService } from "./services/CategoriaService";
import { PublicacionService } from "./services/PublicacionService";
import { ComentarioService } from "./services/ComentarioService";
import { ClaseService } from "./services/ClaseService";
import { CertificadoService } from "./services/CertificadoService";
import { CursoService } from "./services/CursoService";

const store = configureStore({ 
  reducer: {
    GlobalSlice,
    ChatsSlice,
   [UserService.reducerPath]: UserService.reducer,
   [MessageService.reducerPath]: MessageService.reducer,
   [EventoService.reducerPath]: EventoService.reducer,
   [PublicacionService.reducerPath]: PublicacionService.reducer,
   [ComentarioService.reducerPath]: ComentarioService.reducer,
   [CategoriaService.reducerPath]: CategoriaService.reducer,
   [ClaseService.reducerPath]: ClaseService.reducer,
   [CertificadoService.reducerPath]: CertificadoService.reducer,
   [CursoService.reducerPath] : CursoService.reducer

  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(   
        UserService.middleware,
        MessageService.middleware,
        EventoService.middleware,
        PublicacionService.middleware,
        ComentarioService.middleware,
        CategoriaService.middleware,
        ClaseService.middleware,
        CertificadoService.middleware,
        CursoService.middleware
    ),
});

setupListeners(store.dispatch);

export default store;
