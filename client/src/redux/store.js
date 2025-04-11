import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
<<<<<<< HEAD
import storageSession from "redux-persist/lib/storage/session"; // Change to sessionStorage
=======
import storageSession from "redux-persist/lib/storage/session";
>>>>>>> 9ff8d38 (changed the storage to Session storage)
import themeReducer from "./theme/themeSlice";
import userReducer from "./user/userSlice";

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: "root",
<<<<<<< HEAD
  storage: storageSession, // Use sessionStorage instead of localStorage
=======
  storage: storageSession,
>>>>>>> 9ff8d38 (changed the storage to Session storage)
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
