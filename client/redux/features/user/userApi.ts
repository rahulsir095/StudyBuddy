import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      updateAvatar: builder.mutation({
         query: (avatar) => ({
            url: "update-user-avatar",
            method: "PUT",
            body: { avatar },
            credentials: "include" as const,
         }),
         invalidatesTags: ["User"],
      }),

      editProfile: builder.mutation({
         query: ({ name }) => ({
            url: "update-user-info",
            method: "PUT",
            body: { name },
            credentials: "include" as const,
         }),
         invalidatesTags: ["User"],
      }),

      updatePassword: builder.mutation({
         query: ({ oldPassword, newPassword }) => ({
            url: "update-user-password",
            method: "PUT",
            body: { oldPassword, newPassword },
            credentials: "include" as const,
         }),
         invalidatesTags: ["User"],
      }),

      getAllUsers: builder.query({
         query: () => ({
            url: "get-users",
            method: "GET",
            credentials: "include" as const,
         }),
         providesTags: ["Users"],
      }),

      deleteUser: builder.mutation({
         query: (id: string) => ({
            url: `delete-user/${id}`,
            method: "DELETE",
            credentials: "include" as const,
         }),
         invalidatesTags: ["Users"],
      }),
      updateUserRole: builder.mutation({
         query: ({ id, role }) => ({
            url: "update-user", 
            method: "PUT",
            body: { id, role }, 
            credentials: "include" as const,
         }),
         invalidatesTags: ["Users"],
      }),
   }),
});

export const {
   useUpdateAvatarMutation,
   useEditProfileMutation,
   useUpdatePasswordMutation,
   useGetAllUsersQuery,
   useDeleteUserMutation,
   useUpdateUserRoleMutation,
} = userApi;
