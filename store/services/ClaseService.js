import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});
  
export const ClaseService = createApi({
  reducerPath: "ClaseService",
  baseQuery: baseQuery,
  tagTypes: ["ClaseInfo"],
  endpoints: builder => ({
    getClaseInfo: builder.query({
      query: ({cursoId, claseId}) => apiRoutes.claseInfo(claseId, cursoId),
      providesTags: ["ClaseInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
  }),
});

export const {
  useGetClaseInfoQuery,
} = ClaseService;
