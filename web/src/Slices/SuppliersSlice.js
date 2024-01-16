import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const SuppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    sliceSuppliers: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { sliceSuppliers } = SuppliersSlice.actions;
export default SuppliersSlice.reducer;
