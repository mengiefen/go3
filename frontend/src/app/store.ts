import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import { organizationsApi } from '../features/organizations/organizationsApi';
import organizationsReducer from '../features/organizations/organizationsSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [organizationsApi.reducerPath]: organizationsApi.reducer,
    organizations: organizationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      organizationsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;