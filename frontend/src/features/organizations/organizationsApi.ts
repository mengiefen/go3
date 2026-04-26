import { createApi } from '@reduxjs/toolkit/query/react';
import type { Organization } from './types';
import { baseQueryWithCsrf } from '../../app/baseQuery';

export const organizationsApi = createApi({
  reducerPath: 'organizationsApi',
  baseQuery: baseQueryWithCsrf,
  endpoints: (builder) => ({
    getMyOrganizations: builder.query<Organization[], void>({
      query: () => '/organizations?my_organizations=true',
    }),
    createTrialOrganization: builder.mutation<Organization, { name: string }>({
      query: (data) => ({
        url: '/organizations',
        method: 'POST',
        body: {...data, is_trial: true},
      }),
    }),
  }),
});

export const { useGetMyOrganizationsQuery, useCreateTrialOrganizationMutation } = organizationsApi;