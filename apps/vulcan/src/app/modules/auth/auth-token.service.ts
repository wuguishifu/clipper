type AuthTokenProvider = (_: {
  forceRefreshToken: boolean;
}) => Promise<string | null>;

class AuthTokenService {
  private authTokenProvider: AuthTokenProvider | null = null;

  public setAuthTokenProvider(fetchAccessToken: AuthTokenProvider | null) {
    this.authTokenProvider = fetchAccessToken;
  }

  public async getAuthToken({
    forceRefreshToken,
  }: {
    forceRefreshToken?: boolean;
  }): Promise<string | null> {
    return (
      (await this.authTokenProvider?.({
        forceRefreshToken: forceRefreshToken ?? false,
      })) ?? null
    );
  }
}

export const authTokenService = new AuthTokenService();
