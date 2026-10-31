import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Mirrors the JSON in the "isUser" response header
export interface AuthUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface AuthState {
  token: string | null;
  isGuest: boolean;
  user: AuthUser | null;
  otpSent: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  token: null,
  isGuest: true,
  user: null,
  otpSent: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    // call with the guest token returned by the SSR API
    setGuestToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isGuest = true;
      state.user = null;
    },
    // call after a successful login, or when hydrating from the SSR "token" + "isUser" headers
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isGuest = false;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isGuest = true;
      state.otpSent = false;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const { setGuestToken, setCredentials, logout, clearAuthError } =
  authSlice.actions;
export default authSlice.reducer;