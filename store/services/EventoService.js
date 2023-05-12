import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});
  
export const EventoService = createApi({
  reducerPath: "EventoService",
  baseQuery: baseQuery,
  tagTypes: ["Eventos", "EventoInfo", "ListEventos"],
  endpoints: builder => ({
    listarEventos: builder.query({
      query: (page,rowsNumbers, filterData = null,busqueda = '') =>{
        console.log(filterData);
        let query = `${apiRoutes.listarEventos()}?page=${page}&maxRows=${rowsNumbers}`;
        if(filterData){
            if(filterData.categoriasIds && filterData.categoriasIds.length > 0 ){
              var categoriasArrQry = filterData.categoriasIds.map(function(id, idx) {
                return '&categoria[' + idx + ']=' + id;
             }).join('&');
             query = `${query}${categoriasArrQry}`;
             
            }
        }
        if(busqueda && busqueda.trim().length > 0){
          query = `${query}${busqueda}`;
        }
        console.log(query);
        return query;
      },
      providesTags: ["ListEventos"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    createEvento: builder.mutation({
        query: (data) => ({
            url: `${apiRoutes.createEvento()}`,
            method: "POST",
            body: {
                nombre: data?.nombre,
                descripcion: data?.descripcion,
                imagen: data?.imagen,
                es_pago: data?.es_pago,
                precio: data?.precio,
                organizador: data?.organizador,
            }
        }),
        transformResponse(value) {
          const response = value;
          return response;
        },
      }),
    createCurso: builder.mutation({
        query: (value) => ({
            url: `${apiRoutes.createCurso()}`,
            method: "POST",
            body: {
                evento_id: value?.evento_id,
                porcentaje_aprobacion: value?.porcentaje_aprobacion,
                ganancias: value?.ganancias,
            }
        }),
        transformResponse(value) {
          const response = value;
          return response;
        },
      }),
    createModulo: builder.mutation({
        query: (data) => ({
            url: `${apiRoutes.createModulo()}`,
            method: "POST",
            body: {
                evento_id: data?.evento_id,
                nombre: data?.nombre,
                estado: data?.estado,
            }
        }),
        transformResponse(value) {
          const response = value;
          return response;
        },
      }),
    createClase: builder.mutation({
        query: (data) => ({
            url: `${apiRoutes.createClase()}`,
            method: "POST",
            body: {
                modulo_id: data?.evento_id,
                nombre: data?.nombre,
                duracion: data?.duracion,
                estado: data?.estado,
            }
        }),
        transformResponse(value) {
          const response = value;
          return response;
        },
      }),
  }),
});

export const {
  useListarEventosQuery,
  useCreateEventoMutation,
  useCreateCursoMutation,
  useCreateModuloMutation,
  useCreateClaseMutation,
} = EventoService;
