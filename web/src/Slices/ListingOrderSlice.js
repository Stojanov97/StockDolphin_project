import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "tile",
};

export const ListingOrderSlice = createSlice({
  name: "listingOrder",
  initialState,
  reducers: {
    setListingOrder: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setListingOrder } = ListingOrderSlice.actions;
export default ListingOrderSlice.reducer;
