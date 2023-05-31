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
    signIn: builder.mutation({
      query: (data) => ({
        url: apiRoutes.signIn(),
        method: "POST",
        body: data
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    activate: builder.mutation({
      query: (data) => ({
        url: apiRoutes.activate(),
        method: "PUT",
        body: data
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: apiRoutes.signUp(),
        method: "POST",
        body: data
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    checkNickname: builder.query({
      query: (nickname) => `${apiRoutes.checkNickname()}?nickname=${nickname}`,
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),

    changeMeInfo: builder.mutation({
      query: (data) => ({
        url: apiRoutes.me(),
        method: "PUT",
        body: data
      }),

      transformResponse(value) {
        const response = value;
        return response;
      },

    }),
    filterByNicknameOrEmail: builder.query({
      query: (value) => `${apiRoutes.filterByNicknameOrEmail()}?value=${value}`,
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    signUpWithExternalService: builder.mutation({
      query: (data) => ({
        url: apiRoutes.signUpWithExternalService(),
        method: "POST",
        body: {
          nombre: data?.nombre || "",
          nickname: data?.nickname || "",
          email : data?.email,
          biografia: data?.biografia || "",
          imagen: data?.imagen || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
          uid: data?.uid || "",
      }
      }),
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
    changeUserRole: builder.mutation({
      query: (data) => ({
        url: apiRoutes.changeUserRole(),
        method: "PUT",
        body: {
          uid: data?.uid || "",
          role: data?.role || "estudiante",
      }
      }),
      invalidatesTags: ["UserInfo"],
      transformResponse(value) {
        const response = value;
        return response;
      },
    }),
  }),
});

export const {
  useLazyGetCurrentUserQuery,
  useSignInMutation,
  useLazyCheckNicknameQuery,
  useActivateMutation,
  useSignUpMutation,
  useGetCurrentUserQuery,
  useChangeMeInfoMutation,
  useLazyFilterByNicknameOrEmailQuery,
  useFilterByNicknameOrEmailQuery,
  useSignUpWithExternalServiceMutation,
  useChangeUserRoleMutation,
} = UserService;
