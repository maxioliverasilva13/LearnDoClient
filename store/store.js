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
<<<<<<< HEAD
import { CertificadoService } from "./services/CertificadoService";
import { CursoService } from "./services/CursoService";
=======
import { CuponService } from "./services/CuponService";
>>>>>>> 626f1d2f29f4466779efc665e5180394e93fbfa2

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
<<<<<<< HEAD
   [CertificadoService.reducerPath]: CertificadoService.reducer,
   [CursoService.reducerPath] : CursoService.reducer

=======
   [CuponService.reducerPath]: CuponService.reducer,
   
>>>>>>> 626f1d2f29f4466779efc665e5180394e93fbfa2
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
<<<<<<< HEAD
        CertificadoService.middleware,
        CursoService.middleware
=======
        CuponService.middleware,
>>>>>>> 626f1d2f29f4466779efc665e5180394e93fbfa2
    ),
});

setupListeners(store.dispatch);

export default store;
