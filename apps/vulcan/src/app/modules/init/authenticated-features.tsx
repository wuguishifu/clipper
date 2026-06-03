'use client';

import { Authenticated } from 'convex/react';

import { AuthServiceInitializer } from '../auth/components/auth-service-initializer';

export function AuthenticatedFeatures() {
  return (
    <Authenticated>
      <AuthServiceInitializer />
    </Authenticated>
  );
}
