import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import profileReducer from "./slices/profileSlice";
import storage from "redux-persist/es/storage"

const rootReducer = combineReducers({
    user: userReducer,
    profile: profileReducer

})

const persistconfig = {
    key: 'root',
    storage
}
console.log("STORAGE:", storage);

const persistedReducer = persistReducer(persistconfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})
export const persitor = persistStore(store);
export default store;