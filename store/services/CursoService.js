import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";
import baseQueryWithError from "store/baseQueryWithError";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});

export const CursoService = createApi({
  reducerPath: "CursoService",
  baseQuery: baseQueryWithError,
  tagTypes: ["Cursos","canGetCertificat"],
  endpoints: (builder) => ({
    canGetCertificate: builder.query({
      query: ({cursoId}) =>{
        return apiRoutes.canGetCertificate(cursoId);
      } ,
      providesTags: ["Cursos"],
      invalidatesTags: ["canGetCertificate"],
      
      transformResponse(value) {
        const response = value;
        return response;
      },
     }),
   })

    
});

export const { useCanGetCertificateQuery } = CursoService;
