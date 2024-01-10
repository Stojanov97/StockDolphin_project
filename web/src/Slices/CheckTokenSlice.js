import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: true,
};

export const CheckTokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    check: (state) => {
      state.value = !state.value;
    },
  },
});

export const { check } = CheckTokenSlice.actions;
export default CheckTokenSlice.reducer;
