'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { useState } from 'react';

export default function Index() {
  const { signIn, signOut } = useAuthActions();
  const [step, setStep] = useState<'signUp' | 'signIn'>('signIn');

  return (
    <main className="w-full flex-1 flex flex-col items-center justify-center">
      <Authenticated>Authenticated</Authenticated>
      <Unauthenticated>Unauthenticated</Unauthenticated>
      <AuthLoading>Loading</AuthLoading>
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
        <input name="flow" type="hidden" value={step} />
        <button type="submit">
          {step === 'signIn' ? 'Sign in' : 'Sign up'}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep(step === 'signIn' ? 'signUp' : 'signIn');
          }}
        >
          {step === 'signIn' ? 'Sign up instead' : 'Sign in instead'}
        </button>
      </form>
      <button onClick={signOut}>sign out</button>
    </main>
  );
}
