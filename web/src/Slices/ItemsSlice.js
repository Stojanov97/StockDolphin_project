import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const ItemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    sliceItems: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { sliceItems } = ItemsSlice.actions;
export default ItemsSlice.reducer;
