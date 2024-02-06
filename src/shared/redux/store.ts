import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./reducers/userSlice";
import postStorySlice from "./reducers/postStorySlice";
import storiesSlice from "./reducers/stories";
import signInSlice from "./reducers/sigInSlice";

const rootReducer = combineReducers({
  user: userSlice,
  postStory: postStorySlice,
  stories: storiesSlice,
  signIn: signInSlice,
});
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "postStory"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: {
    root: persistedReducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["register"],
        ignoredActionPaths: ["rehydrate", "register"],
        ignoredPaths: ["register"],
      },
    }),
});

const persistor = persistStore(store);
export { store, persistor };
