'use client';

import { useAuthActions } from '@convex-dev/auth/react';

export default function Main() {
  const { signOut } = useAuthActions();

  return (
    <main className="w-full flex-1">
      <h1>main</h1>
      <button onClick={signOut}>sign out</button>
    </main>
  );
}
