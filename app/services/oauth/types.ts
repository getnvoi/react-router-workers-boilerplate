export interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
}

export interface NormalizedUser {
  id: string; // Provider's user ID
  email: string;
  name: string;
  avatarUrl?: string;
  login?: string; // GitHub username
}

export interface OAuthProvider {
  name: string;
  authorizationUrl: (state: string, redirectUri: string) => string;
  exchangeToken: (
    code: string,
    redirectUri: string,
    env: Env,
  ) => Promise<TokenResponse>;
  fetchUserInfo: (accessToken: string) => Promise<NormalizedUser>;
}
