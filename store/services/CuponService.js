import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});

export const CuponService = createApi({
  reducerPath: "CuponService",
  baseQuery: baseQuery,
  tagTypes: ["CuponInfo"],
  endpoints: (builder) => ({
    createCupon: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.crearCupon()}`,
        method: "POST",
        body: {
          evento_id: data?.evento_id,
          user_id_from: data?.user_id_from,
        },
      }),
    }),
    usarCupon: builder.query({
      query: (data) => `${apiRoutes.usarCupon()}?token=${data?.token}`,
      invalidatesTags: ["CuponInfo"],
    }),
    validarCupon: builder.query({
      query: (data) => `${apiRoutes.validarCupon()}?token=${data?.token}&eventoId=${data?.cursoId}`,
      providesTags: ["CuponInfo"],
    }),
  }),
});

export const {
    useCreateCuponMutation,
    useLazyUsarCuponQuery,
    useValidarCuponQuery,
} = CuponService;
