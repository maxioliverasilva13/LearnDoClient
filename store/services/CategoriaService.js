import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";
import baseQueryWithError from "store/baseQueryWithError";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});

export const CategoriaService = createApi({
  reducerPath: "CategoriaService",
  baseQuery: baseQueryWithError,
  tagTypes: ["Categorias"],
  endpoints: (builder) => ({
    getCategorias: builder.query({
      query: () => apiRoutes.listarCategorias(),
      providesTags: ["Categorias"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
  }),
});

export const { useGetCategoriasQuery } = CategoriaService;
