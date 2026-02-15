// import { AuthResponseT, LoginRequestT, SignupRequestT, UserT } from 'src/types';
import baseApi from './baseApi';
import { TagName } from '../lib/tags';
import type {

} from '../../types';


export type resultT = {
  uuid: string;
  datasetId: number;
  sessionID?:number;
  stoppingStep: number;
  score: number;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    submitResult: build.mutation<void, resultT>({
      query: (body) => ({
        url: '/gameResults',
        method: 'POST',
        body: body,
        provideTags: [{ type: TagName.Result }],
      }),
    }),
    getAllResults: build.query<resultT[], void>({
      query: () => ({
        url: '/gameResults',
        method: 'GET',
      }),
      providesTags: [{ type: TagName.Result, id: 'LIST' }],
    }),
    getLeaderboard: build.query<resultT[], void>({
      query: () => ({
        url: '/gameResults/leaderboard',
        method: 'GET',
      }),
      providesTags: [{ type: TagName.Result, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { 
  useSubmitResultMutation,
  useGetAllResultsQuery,
  useGetLeaderboardQuery
} = authApi;
