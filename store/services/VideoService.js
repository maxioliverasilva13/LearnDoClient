import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";
import baseQueryWithError from "store/baseQueryWithError";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});

export const VideoService = createApi({
  reducerPath: "VideoService",
  baseQuery: baseQueryWithError,
  tagTypes: ["VideoB64"],
  endpoints: (builder) => ({
    getBase64OfVideo: builder.query({
      query: ({ claseId }) => {
        const query = apiRoutes.getVideoBase64(claseId);
        return query;
      },
      providesTags: ["VideoB64"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
  }),
});

export const { useLazyGetBase64OfVideoQuery } = VideoService;
