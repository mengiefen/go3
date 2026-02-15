import baseApi from './baseApi';

export const healthApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getHealth: build.query<{ status: string }, void>({
      query: () => ({
        url: '/api/health',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});


export const { useGetHealthQuery } = healthApi;