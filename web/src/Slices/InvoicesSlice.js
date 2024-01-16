import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const InvoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    sliceInvoices: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { sliceInvoices } = InvoicesSlice.actions;
export default InvoicesSlice.reducer;
