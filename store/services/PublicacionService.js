import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import apiRoutes from "routes/apiRoutes";
import { prepareHeaders } from "../../utils/prepareHeaders";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders,
});
  
export const PublicacionService = createApi({
  reducerPath: "PublicacionService",
  baseQuery: baseQuery,
  tagTypes: ["ListPublicaciones"],
  endpoints: builder => ({
    listarPublicacionesByForoId: builder.query({
      query: ({foroId})  => {
        const query = `/api/publicaciones/listByForoId/${foroId}`;
        console.log(query);
        return query;
      },
      providesTags: ["ListPublicaciones"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    createPost: builder.mutation({
      query: (data) => ({
        url: `${apiRoutes.createPost()}`,
        method: "POST",
        body: {
           ...data 

        },
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
      invalidatesTags: ["CreatePost"],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/api/publicaciones/${id}`,
        method: "DELETE",
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
      invalidatesTags: ["DeletePost"],
    }),
 
  })

});

export const {
    useListarPublicacionesByForoIdQuery,
    useCreatePostMutation,
    useDeletePostMutation
} = PublicacionService;
