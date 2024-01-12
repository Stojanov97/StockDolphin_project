import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

export const OrdersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    sliceOrders: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { sliceOrders } = OrdersSlice.actions;
export default OrdersSlice.reducer;
