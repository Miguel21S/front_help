import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import profileReducer from "./slices/profileSlice";
import storage from "redux-persist/es/storage"
// import { apiSlice } from "./apiSlice";

const rootReducer = combineReducers({
    user: userReducer,
    profile: profileReducer,
    // [apiSlice.reducerPath]: apiSlice.reducer

})

const persistconfig = {
    key: 'root',
    storage
}

const persistedReducer = persistReducer(persistconfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
    // }).concat(apiSlice.middleware),
})
export const persitor = persistStore(store);
export default store;