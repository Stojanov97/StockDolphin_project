import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: false,
};

export const checkForDBUpdatedSlice = createSlice({
  name: "checkForDBUpdates",
  initialState,
  reducers: {
    checkDB: (state) => {
      state.value = !state.value;
    },
  },
});

export const { checkDB } = checkForDBUpdatedSlice.actions;
export default checkForDBUpdatedSlice.reducer;
