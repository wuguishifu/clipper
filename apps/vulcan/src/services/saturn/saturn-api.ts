'use client';

import { tsRestFetchApi } from '@ts-rest/core';
import { initTsrReactQuery } from '@ts-rest/react-query/v5';

import { saturnRootRouter } from '@clipper/contracts-saturn';

import { authTokenService } from '../../app/modules/auth/auth-token.service';

export const getSaturnServerUrl = () => {
  const url = process.env.NEXT_PUBLIC_SATURN_BASE_URL;
  if (!url) throw new Error('Saturn base URL is not configured');
  return url;
};

export const saturnApi = initTsrReactQuery(saturnRootRouter, {
  baseUrl: getSaturnServerUrl(),
  api: async (args) => {
    const authToken = await authTokenService.getAuthToken({
      forceRefreshToken: false,
    });

    args.headers.Authorization = `Bearer ${authToken}`;

    return tsRestFetchApi(args);
  },
});
