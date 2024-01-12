import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const DecodedTokenSlice = createSlice({
  name: "decodedToken",
  initialState,
  reducers: {
    setTokenPayload: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setTokenPayload } = DecodedTokenSlice.actions;

export default DecodedTokenSlice.reducer;
