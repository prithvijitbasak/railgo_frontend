import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
  email: string;
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// NOTE: adjust these paths to match your SendEmailLoginOtpController / VerifyEmailLoginOtpController
export const sendLoginOtp = createAsyncThunk<
  void,
  { email: string },
  { rejectValue: string }
>("auth/sendLoginOtp", async ({ email }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/api/public/auth/send-email-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) return rejectWithValue("Failed to send OTP");
  } catch {
    return rejectWithValue("Network error");
  }
});

export const verifyLoginOtp = createAsyncThunk<
  { token: string; user: AuthUser },
  { email: string; otp: string },
  { rejectValue: string }
>("auth/verifyLoginOtp", async ({ email, otp }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_URL}/api/public/auth/verify-email-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    if (!res.ok) return rejectWithValue("Invalid or expired OTP");
    const data = await res.json();
    // adjust to your response shape
    return { token: data.token, user: { email } };
  } catch {
    return rejectWithValue("Network error");
  }
});

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
    // call when hydrating from a cookie that holds a real login token
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
  extraReducers: (builder) => {
    builder
      .addCase(sendLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendLoginOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(sendLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      .addCase(verifyLoginOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isGuest = false;
        state.otpSent = false;
        // also write the token to the cookie here (or in the component) via your authClient helper
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { setGuestToken, setCredentials, logout, clearAuthError } =
  authSlice.actions;
export default authSlice.reducer;