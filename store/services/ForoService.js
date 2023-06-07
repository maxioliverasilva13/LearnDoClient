import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";
import baseQueryWithError from "store/baseQueryWithError";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});

export const ForoService = createApi({
  reducerPath: "ForoService",
  baseQuery: baseQueryWithError,
  tagTypes: ["ForoInfo"],
  endpoints: (builder) => ({
    getForo: builder.query({
      query: (data) => {
        const { page, rowsNumbers, filterData = null, busqueda = "" } = data;
        let query = `${apiRoutes.listarEventos()}?page=${page}&maxRows=${rowsNumbers}`;
        if (filterData) {
          if (filterData.categoriasIds && filterData.categoriasIds.length > 0) {
            var categoriasArrQry = filterData.categoriasIds
              .map(function (id, idx) {
                return "&categoria[" + idx + "]=" + id;
              })
              .join("&");
            query = `${query}${categoriasArrQry}`;
          }
        }
        if (busqueda && busqueda.trim().length > 0) {
          query = `${query}${busqueda}`;
        }
        // console.log(query);
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
  useGetForoQuery,
} = ForoService;
