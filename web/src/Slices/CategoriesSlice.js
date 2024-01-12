import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const CategoriesSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    sliceCategories: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { sliceCategories } = CategoriesSlice.actions;
export default CategoriesSlice.reducer;
