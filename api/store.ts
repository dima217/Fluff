import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import userReducer from './slices/userSlice';
import {
  getPersistedIsAuthenticated,
  setPersistedIsAuthenticated,
} from './utils/authSessionStorage';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    user: userReducer,
  },
  preloadedState: {
    user: {
      profile: null,
      isLoading: false,
      isAuthenticated: getPersistedIsAuthenticated(),
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(baseApi.middleware),
});

let lastPersistedIsAuthenticated = getPersistedIsAuthenticated();
store.subscribe(() => {
  const isAuthenticated = store.getState().user.isAuthenticated;
  if (isAuthenticated !== lastPersistedIsAuthenticated) {
    lastPersistedIsAuthenticated = isAuthenticated;
    setPersistedIsAuthenticated(isAuthenticated);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
