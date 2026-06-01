import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';

import { PASSWORD_PROVIDER_ID } from './common/auth/passwordAccounts';
import { environment } from './common/constants';

const providers = [
  Password({
    id: PASSWORD_PROVIDER_ID,
  }),
];

const allowedSchemas = ['vulcan://'];

const allowedWebRedirectPatterns = [
  /^http:\/\/localhost:\d{2,5}(\/|$)/,
] as const;

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers,
  callbacks: {
    redirect: ({ redirectTo }) => {
      if (redirectTo.startsWith('/')) {
        return Promise.resolve(`${environment.CONVEX_SITE_URL}${redirectTo}`);
      }

      if (
        environment.CONVEX_SITE_URL &&
        redirectTo.startsWith(environment.CONVEX_SITE_URL)
      ) {
        return Promise.resolve(redirectTo);
      }

      if (allowedSchemas.some((prefix) => redirectTo.startsWith(prefix))) {
        return Promise.resolve(redirectTo);
      }

      if (
        allowedWebRedirectPatterns.some((pattern) => pattern.test(redirectTo))
      ) {
        return Promise.resolve(redirectTo);
      }

      throw new Error(`Invalid redirect target: ${redirectTo}`);
    },
  },
});
