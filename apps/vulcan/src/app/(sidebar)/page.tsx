'use client';

import Link from 'next/link';
import { useAuthActions } from '@convex-dev/auth/react';

export default function Main() {
  const { signOut } = useAuthActions();

  return (
    <main className="w-full flex-1 flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">Home</h1>
      <Link
        href="/clips"
        className="text-sm underline underline-offset-2 w-fit"
      >
        Clip Trimmer
      </Link>
      <button className="text-sm w-fit" onClick={signOut}>
        Sign out
      </button>
    </main>
  );
}
