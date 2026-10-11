import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UiState = { loginModalOpen: boolean };

export const initialUiState: UiState = { loginModalOpen: false };

const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    setLoginModalOpen: (state, action: PayloadAction<boolean>) => {
      state.loginModalOpen = action.payload;
    },
  },
});

export const { setLoginModalOpen } = uiSlice.actions;
export default uiSlice.reducer;