import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/authApi';
import { organizationsApi } from '../features/organizations/organizationsApi';
import { membersApi } from '../features/members/membersApi';
import organizationsReducer from '../features/organizations/organizationsSlice';
import authReducer from '../features/auth/authSlice';


export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [organizationsApi.reducerPath]: organizationsApi.reducer,
    [membersApi.reducerPath]: membersApi.reducer,
    organizations: organizationsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware, 
      organizationsApi.middleware,
      membersApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;