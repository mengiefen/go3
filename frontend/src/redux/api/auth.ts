// import { AuthResponseT, LoginRequestT, SignupRequestT, UserT } from 'src/types';
import baseApi from './baseApi';
import { TagName } from '../lib/tags';
import type { AuthResponseT, LoginRequestT, SignupRequestT } from '../../types';

export type UserT ={
  userID:number,
  uuid:string,
  userName:string,
  email?:string,
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthResponseT, LoginRequestT>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
        provideTags: [{ type: TagName.Auth }],
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('token', data.accessToken);
        } catch (err) {
          console.error('Login failed', err);
        }
      },
    }),
    signup: build.mutation<UserT, SignupRequestT>({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),
    updateUserByUUID: build.mutation<any, any>({
      query: (body) => ({
        url: `/users/by-uuid`,
        method: 'PATCH',
        body,
      }),
    }),
    logout: build.mutation<void, void>({
      query: () => `auth/logout`,
      invalidatesTags: [{ type: TagName.Auth }],
    }),
    initUser: build.query<UserT, string>({
      query: (id) => ({
        url: '/users/init',
        body: {uuid: id},
        method: 'POST',
      }),
      providesTags: [{ type: TagName.Auth }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useInitUserQuery,
  useUpdateUserByUUIDMutation
} = authApi;
