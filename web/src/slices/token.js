import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: false,
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    loginToken: (state, action) => (state.token = action.token),
    deleteToken: (state) => (state.token = false),
  },
});

export const { loginToken, deleteToken } = tokenSlice.actions;
export const token = (state) => state.token.token;
export default tokenSlice.reducer;
