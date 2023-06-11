import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";
import baseQueryWithError from "store/baseQueryWithError";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});

export const ComentarioService = createApi({
  reducerPath: "ComentarioService",
  baseQuery: baseQueryWithError,
  tagTypes: ["Comentarios"],
  endpoints: (builder) => ({
    listarComentariosByPublicacionId: builder.query({
      query: ({publicacionId}) =>{
            const query =  `/api/comentarios/listByPublicacionId/${publicacionId}`;
            console.log(query);
            return query;
      } ,
      providesTags: ["Comentarios"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),

    createComment: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.createComment()}`,
        method: "POST",
        body: {
           ...data

        },
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
      invalidatesTags: ["CreateComment"],
    }),

    deleteComment: builder.mutation({
      query: (id) => ({
        url: `/api/comentarios/${id}`,
        method: "DELETE",
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
      invalidatesTags: ["DeleteComment"],
    }),

  }),
});

export const { useListarComentariosByPublicacionIdQuery,useCreateCommentMutation, useDeleteCommentMutation } = ComentarioService;
