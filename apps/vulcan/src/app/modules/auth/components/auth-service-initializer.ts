'use client';

import { useConvexAuth } from '@convex-dev/auth/react';
import { useEffect } from 'react';

import { authTokenService } from '../auth-token.service';

export function AuthServiceInitializer() {
  const { fetchAccessToken } = useConvexAuth();

  useEffect(() => {
    authTokenService.setAuthTokenProvider(fetchAccessToken);
    return () => authTokenService.setAuthTokenProvider(null);
  }, [fetchAccessToken]);

  return null;
}
