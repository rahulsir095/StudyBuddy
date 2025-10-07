import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    credentials: "include",
  }),
  tagTypes: ["Users", "User","Courses"],
  endpoints: (builder) => ({
    refreshToken: builder.query<{ accessToken: string }, void>({
      query: () => ({
        url: "refresh",
        method: "GET", 
        credentials: "include" as const,
      }),
    }),

    loadUser: builder.query<{ accessToken: string; user: any }, void>({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),
      providesTags: ["User"],
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log("User not logged in or refresh failed", error);
        }
      },
    }),
  }),
});

export const {
  useRefreshTokenQuery,
  useLoadUserQuery,
  useLazyRefreshTokenQuery,
  useLazyLoadUserQuery,
} = apiSlice;
