import { combineReducers } from "@reduxjs/toolkit";
import token from "../Slices/CheckTokenSlice";
import theme from "../Slices/ThemeSlice";
import forgot from "../Slices/ForgotPasswordSlice";
import decodedToken from "../Slices/DecodedTokenSlice";
import listingOrder from "../Slices/ListingOrderSlice";
import categories from "../Slices/CategoriesSlice";
import items from "../Slices/ItemsSlice";
import orders from "../Slices/OrdersSlice";
import checkDB from "../Slices/CheckForDBUpdatesSlice";

const rootReducer = combineReducers({
  theme,
  token,
  forgot,
  decodedToken,
  listingOrder,
  categories,
  items,
  orders,
  checkDB,
});

export default rootReducer;
