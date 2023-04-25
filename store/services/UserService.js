import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});
  
export const UserService = createApi({
  reducerPath: "UserService",
  baseQuery: baseQuery,
  tagTypes: ["UserInfo"],
  endpoints: builder => ({
    getCurrentUser: builder.query({
      query: () => apiRoutes.me(),
      providesTags: ["UserInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
} = UserService;
