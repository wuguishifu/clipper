'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { signIn } = useAuthActions();
  const { isAuthenticated } = useConvexAuth();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated]);

  return (
    <main className="w-full flex-1">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          void signIn('password', formData);
        }}
        className="border"
      >
        <input name="email" placeholder="Email" type="text" />
        <input name="password" placeholder="Password" type="password" />
        <input name="flow" type="hidden" value="signUp" />
        <button type="submit">sign in</button>
      </form>
    </main>
  );
}
