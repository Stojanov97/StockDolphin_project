import { combineReducers } from "@reduxjs/toolkit";
import token from "../Slices/CheckTokenSlice";
import theme from "../Slices/ThemeSlice";
import forgot from "../Slices/ForgotPasswordSlice";

const rootReducer = combineReducers({ theme, token, forgot });

export default rootReducer;
