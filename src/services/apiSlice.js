import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getDashboard: builder.query({
      query: () => 'dashboard',
    }),
    getTeams: builder.query({
      query: () => 'teams',
    }),
    getInNews: builder.query({
      query: () => 'primus/in-news',
    }),
    getEvents: builder.query({
      query: () => 'primus/events',
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifyLogin: builder.mutation({
      query: (data) => ({
        url: 'auth/login/verify',
        method: 'POST',
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: 'auth/login/resend-otp',
        method: 'POST',
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => 'auth/me',
    }),
    // Client Dashboard: fetch project summary for a client
    getClientDashboard: builder.query({
      query: (clientEmail) => ({
        url: 'client/dashboard',
        method: 'POST',
        body: { client_email: clientEmail },
      }),
    }),
    // Project Overview: fetch detailed dashboard for a specific project
    getProjectDashboard: builder.query({
      query: (projectNo) => `client/${projectNo}/dashboard`,
    }),
  }),
});

export const { 
  useGetDashboardQuery, 
  useGetTeamsQuery, 
  useGetInNewsQuery, 
  useGetEventsQuery,
  useLoginMutation,
  useVerifyLoginMutation,
  useResendOtpMutation,
  useGetMeQuery,
  useGetClientDashboardQuery,
  useGetProjectDashboardQuery,
} = apiSlice;
