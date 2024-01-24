import { combineReducers } from "@reduxjs/toolkit";
import checkToken from "../Slices/CheckTokenSlice";
import theme from "../Slices/ThemeSlice";
import forgot from "../Slices/ForgotPasswordSlice";
import decodedToken from "../Slices/DecodedTokenSlice";
import listingOrder from "../Slices/ListingOrderSlice";
import categories from "../Slices/CategoriesSlice";
import items from "../Slices/ItemsSlice";
import orders from "../Slices/OrdersSlice";
import suppliers from "../Slices/SuppliersSlice";
import invoices from "../Slices/InvoicesSlice";
import checkDB from "../Slices/CheckForDBUpdatesSlice";
import loading from "../Slices/LoadingSlice";

const rootReducer = combineReducers({
  theme,
  checkToken,
  forgot,
  decodedToken,
  listingOrder,
  categories,
  items,
  orders,
  suppliers,
  invoices,
  checkDB,
  loading,
});

export default rootReducer;
