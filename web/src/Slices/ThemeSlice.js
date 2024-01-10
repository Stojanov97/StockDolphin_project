import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: true,
};

export const ThemeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggle: (state) => {
      state.value = !state.value;
    },
  },
});

export const { toggle } = ThemeSlice.actions;
export default ThemeSlice.reducer;
