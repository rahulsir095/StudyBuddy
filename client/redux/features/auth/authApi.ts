import { apiSlice } from "../api/apiSlice";
import { userRegistration, userLoggedIn, userLoggedOut } from "./authSlice";

type RegistrationResponse = {
   message: string;
   activationToken: string;
};

type RegistrationData = {
   name: string;
   email: string;
   password: string;
};

type ActivationResponse = {
   user: any;
};

type ActivationData = {
   activationToken: string;
   activationCode: string;
};

export const authApi = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      register: builder.mutation<RegistrationResponse, RegistrationData>({
         query: (data) => ({
            url: "register",
            method: "POST",
            body: data,
            credentials: "include" as const,
         }),
         async onQueryStarted(arg, { queryFulfilled, dispatch }) {
            try {
               const result = await queryFulfilled;
               dispatch(
                  userRegistration({
                     token: result.data.activationToken,
                  })
               );
            } catch (error: any) {
               console.log(error);
            }
         }, 
      }),
      activation: builder.mutation<ActivationResponse, ActivationData>({
         query: ({ activationToken, activationCode }) => ({
            url: "activate-account",
            method: "POST",
            body: {
               activationToken,
               activationCode,
            },
         }),
      }),
      login: builder.mutation({
         query: ({ email, password }) => ({
            url: "login",
            method: "POST",
            body: {
               email,
               password,
            },
            credentials: "include" as const,
         }),
         async onQueryStarted(arg, { queryFulfilled, dispatch }) {
            try {
               const result = await queryFulfilled;
               dispatch(
                  userLoggedIn({
                     accessToken: result.data.accessToken,
                     user: result.data.user,
                  })
               );
            } catch (error: any) {
               console.log(error);
            }
         },
      }),
      socialAuth: builder.mutation({
         query: ({ name, email, avatar }) => ({
            url: "social-auth",
            method: "POST",
            body: {
               name,
               email,
               avatar,
            },
            credentials: "include" as const,
         }),
         async onQueryStarted(arg, { queryFulfilled, dispatch }) {
            try {
               const result = await queryFulfilled;
               dispatch(
                  userLoggedIn({
                     accessToken: result.data.accessToken,
                     user: result.data.user,
                  })
               );
            } catch (error: any) {
               console.log(error);
            }
         },
      }),
      logOut: builder.query<void, void>({
         query: () => ({
           url: "logout",
           method: "GET",
           credentials: "include" as const,
         }),
         async onQueryStarted(arg, { dispatch, queryFulfilled }) {
           try {
             await queryFulfilled;
             dispatch(userLoggedOut());
           } catch (error: any) {
             console.log("Logout error:", error);
           }
         },
       }),
       
   }),
});

export const {
   useRegisterMutation,
   useActivationMutation,
   useLoginMutation,
   useSocialAuthMutation,
   useLogOutQuery,
} = authApi;
