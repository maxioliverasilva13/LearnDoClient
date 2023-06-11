import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";
import baseQueryWithError from "store/baseQueryWithError";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});

export const MessageService = createApi({
  reducerPath: "MessageService",
  baseQuery: baseQueryWithError,
  tagTypes: ["ListMessages"],
  endpoints: (builder) => ({
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
        },
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    changeIsRead: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.changeIsRead()}`,
        method: "POST",
        body: {
          message_id: data?.messageId,
          value: data?.value,
        },
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
  }),
});

export const { useGetMessagesQuery, useCreateMessageMutation, useChangeIsReadMutation } = MessageService;
