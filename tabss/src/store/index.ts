import { configureStore } from '@reduxjs/toolkit';
import baseApi from './api/baseApi';
import { authApi } from '@/features/auth/authApi';
import authReducer from '@/features/auth/authSlice';
import { membersApi } from '@/features/members/membersApi';
import { organizationsApi } from '@/features/organizations/organizationsApi';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [membersApi.reducerPath]: membersApi.reducer,
    [organizationsApi.reducerPath]: organizationsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware, authApi.middleware, membersApi.middleware, organizationsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;