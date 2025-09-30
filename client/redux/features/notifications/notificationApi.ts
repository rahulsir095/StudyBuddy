import { apiSlice } from "../api/apiSlice";

export const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all notifications
    getAllNotifications: builder.query({
      query: () => ({
        url: "get-all-notifications",
        method: "GET",
        credentials: "include" as const,
      }),
    }),

    // Update notification status
    updateNotificationStatus: builder.mutation({
      query: (id: string) => ({
        url: `update-notification/${id}`,
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetAllNotificationsQuery,
  useUpdateNotificationStatusMutation,
} = notificationsApi;
