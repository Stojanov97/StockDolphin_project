import { configureStore } from "@reduxjs/toolkit";
import token from "../slices/token";

export const store = configureStore({
  reducer: { token: token },
});
