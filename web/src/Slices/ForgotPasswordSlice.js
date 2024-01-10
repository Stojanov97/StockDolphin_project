import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const ForgotPasswordSlice = createSlice({
  name: "passwordForget",
  initialState,
  reducers: {
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggle } = ForgotPasswordSlice.actions;
export default ForgotPasswordSlice.reducer;
