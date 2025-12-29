import type { OAuthProvider, TokenResponse, NormalizedUser } from "../types";

const AUTHORIZATION_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://www.googleapis.com/oauth2/v4/token";
const USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
const DEFAULT_SCOPE = "openid email profile";

export const googleProvider: OAuthProvider = {
  name: "google",

  authorizationUrl(state: string, redirectUri: string): string {
    const url = new URL(AUTHORIZATION_URL);
    url.searchParams.set("client_id", "GOOGLE_CLIENT_ID"); // Placeholder
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", DEFAULT_SCOPE);
    url.searchParams.set("state", state);
    url.searchParams.set("access_type", "offline");
    url.searchParams.set("prompt", "select_account");
    return url.toString();
  },

  async exchangeToken(
    code: string,
    redirectUri: string,
    env: Env,
  ): Promise<TokenResponse> {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!response.ok) {
      throw new Error(`Google token exchange failed: ${response.statusText}`);
    }

    const data = await response.json<TokenResponse & { error?: string }>();

    if (data.error || !data.access_token) {
      throw new Error(`Google OAuth error: ${data.error || "No access token"}`);
    }

    return data;
  },

  async fetchUserInfo(accessToken: string): Promise<NormalizedUser> {
    const response = await fetch(USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Google user fetch failed: ${response.statusText}`);
    }

    const userData = await response.json<{
      sub: string; // Google's user ID
      email: string;
      name: string;
      picture?: string;
    }>();

    return {
      id: userData.sub,
      email: userData.email,
      name: userData.name,
      avatarUrl: userData.picture,
    };
  },
};
