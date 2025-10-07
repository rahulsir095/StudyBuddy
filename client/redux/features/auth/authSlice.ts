import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// User type
interface User {
  _id: string;
  name: string;
  email: string;
  role: string; // admin / user
  avatar:{
   url:string;
  }
}

// Auth state type
interface AuthState {
  token: string;
  user: User | null;
}

// Initial state
const initialState: AuthState = {
  token: "",
  user: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (state, action: PayloadAction<{ accessToken: string; user: User }>) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = "";
      state.user = null;
    },
  },
});

// Export actions and reducer
export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
