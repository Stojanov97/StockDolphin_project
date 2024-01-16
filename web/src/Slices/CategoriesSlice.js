import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const CategoriesSlice = createSlice({
  name: "categries",
  initialState,
  reducers: {
    sliceCategories: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { sliceCategories } = CategoriesSlice.actions;
export default CategoriesSlice.reducer;
