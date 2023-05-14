import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});
  
export const EventosService = createApi({
  reducerPath: "EventosService",
  baseQuery: baseQuery,
  tagTypes: ["Evento"],
  endpoints: builder => ({
    createEvento: builder.mutation({
      query: (data) => {
        return {
          url: apiRoutes.createEvento(),
          method: "POST",
          body: data,
        }
      },
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
 
  }),
});

export const {
  useCreateEventoMutation,
} = EventosService;
