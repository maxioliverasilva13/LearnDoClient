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
  tagTypes: ["EventoInfo"],
  endpoints: builder => ({
    listarEventos: builder.query({
      query: (page,rowsNumbers, filterData = null,busqueda = '') =>{
        let query = `${apiRoutes.listarEventos()}?page=${nickname}&maxRows=${rowsNumbers}`;
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
          return query;
      },
      providesTags: ["ListEventos"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
  
  }),
});

export const {
  useListarEventosQuery
} = EventoService;
