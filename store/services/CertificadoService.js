import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});

export const CertificadoService = createApi({
  reducerPath: "Certificado",
  baseQuery: baseQuery,
  tagTypes: ["CreateCertificate","GetCertificate"],
  endpoints: (builder) => ({
    createCertificate: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.createCertificate()}`,
        method: "POST",
        body: {
          ...data
        },
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
      invalidatesTags: ["CreateCertificate"],
    }),

    
    getCertificatePDF: builder.query({
      query: (certificateId) => {
          return apiRoutes.getCertificatePDF(certificateId);
      },
      providesTags: ["GetCertificatePDF"],
      transformResponse(value) {
        const response = value;
    
        return response;
      },
    }),
   
  }),
});

export const {
  useCreateCertificateMutation,
  useLazyGetCertificatePDFQuery
} = CertificadoService;
