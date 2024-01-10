import { createStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import ThemeReducer from "../Slices/ThemeSlice";

const persistConfig = {
  key: "theme",
  storage,
};

const persistedReducer = persistReducer(persistConfig, ThemeReducer);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
