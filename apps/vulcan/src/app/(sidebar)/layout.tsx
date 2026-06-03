'use client';

import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { PropsWithChildren } from 'react';

import { Spinner } from '@clipper/ui-web';

import { Redirect } from '../../components/redirect';

export default function SidebarLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Unauthenticated>
        <Redirect path="/login" />
      </Unauthenticated>
      <Authenticated>{children}</Authenticated>
      <AuthLoading>
        <Spinner />
      </AuthLoading>
    </>
  );
}
