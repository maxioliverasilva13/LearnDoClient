import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});
  
export const MessageService = createApi({
  reducerPath: "MessageService",
  baseQuery: baseQuery,
  tagTypes: ["ListMessages"],
  endpoints: builder => ({
    getMessages: builder.query({
      query: (uid) => `${apiRoutes.getMessages()}?user_id=${uid}`,
      providesTags: ["ListMessages"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    createMessage: builder.mutation({
        query: (data) => ({
            url: `${apiRoutes.createMessage()}`,
            method: "POST",
            body: {
                user_from_id: data?.user_from_id,
                user_to_id: data?.user_to_id,
                message: data?.message,
            }
        }),
        transformResponse(value) {
          const response = value;
          return response;
        },
      }),
  }),
});

export const {
  useGetMessagesQuery,
  useCreateMessageMutation,
} = MessageService;
