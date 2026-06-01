import { retrieveAccount } from '@convex-dev/auth/server';

export const PASSWORD_PROVIDER_ID = 'password';

export type RetrieveAccountFailure =
  | 'InvalidAccountId'
  | 'InvalidSecret'
  | 'TooManyFailedAttempts';

export const getRetrieveAccountFailure = (
  error: unknown,
): RetrieveAccountFailure | null => {
  if (!(error instanceof Error)) {
    return null;
  }

  switch (error.message) {
    case 'InvalidAccountId':
    case 'InvalidSecret':
    case 'TooManyFailedAttempts':
      return error.message;
    default:
      return null;
  }
};

export const retrievePasswordAccountByEmail = async (
  ctx: Parameters<typeof retrieveAccount>[0],
  email: string,
) => {
  try {
    return await retrieveAccount(ctx, {
      provider: PASSWORD_PROVIDER_ID,
      account: { id: email },
    });
  } catch (error) {
    if (getRetrieveAccountFailure(error) === 'InvalidAccountId') {
      return null;
    }

    throw error;
  }
};
