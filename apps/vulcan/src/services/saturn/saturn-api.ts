'use client';

import { initClient, tsRestFetchApi } from '@ts-rest/core';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';

import { saturnRootRouter } from '@clipper/contracts-saturn';

import { authTokenService } from '../../app/modules/auth/auth-token.service';

export const getSaturnServerUrl = () => {
  const url = process.env.NEXT_PUBLIC_SATURN_BASE_URL;
  if (!url) throw new Error('Saturn base URL is not configured');
  return url;
};

const makeApi = async (args: Parameters<typeof tsRestFetchApi>[0]) => {
  const authToken = await authTokenService.getAuthToken({
    forceRefreshToken: false,
  });
  args.headers.Authorization = `Bearer ${authToken}`;
  return tsRestFetchApi(args);
};

// React Query hooks (for use in components)
export const saturnApi = initTsrReactQuery(saturnRootRouter, {
  baseUrl: getSaturnServerUrl(),
  api: makeApi,
});

// Plain async client (for use in non-hook async code)
export const saturnClient = initClient(saturnRootRouter, {
  baseUrl: getSaturnServerUrl(),
  api: makeApi,
});
