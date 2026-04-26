import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getCsrfToken } from '../utils/csrf';

export const baseQueryWithCsrf = fetchBaseQuery({
  baseUrl: 'http://localhost:5000',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers.set('X-CSRF-Token', csrfToken);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});