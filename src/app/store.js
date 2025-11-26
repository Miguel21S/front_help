import { persisteReducer, persistStore } from "redux-persist"
import { combineReducers } from "redux";
import { userSlice } from "./slices/userSlice";
import { profileReducer } from "./slices/profileSlice";
import storage from "redux-persist/lib/storage"
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    user: userSlice,
    profile: profileReducer

})

const persistconfig = {
    key: 'root',
    storage
}

const persistedReducer = persisteReducer(persistconfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
})

export const persitor = persistStore(store);
export default store;