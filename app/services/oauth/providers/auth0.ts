import type { OAuthProvider, TokenResponse, NormalizedUser } from "../types";

const DEFAULT_SCOPE = "openid email profile";

export const auth0Provider: OAuthProvider = {
  name: "auth0",

  authorizationUrl(state: string, redirectUri: string): string {
    // Auth0 requires a domain, which should be in AUTH0_DOMAIN env var
    // e.g., "your-tenant.auth0.com" or "your-tenant.us.auth0.com"
    const domain = "AUTH0_DOMAIN"; // Placeholder
    const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;

    const url = new URL(`${baseUrl}/authorize`);
    url.searchParams.set("client_id", "AUTH0_CLIENT_ID"); // Placeholder
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", DEFAULT_SCOPE);
    url.searchParams.set("state", state);
    return url.toString();
  },

  async exchangeToken(
    code: string,
    redirectUri: string,
    env: Env,
  ): Promise<TokenResponse> {
    const domain = env.AUTH0_DOMAIN;
    if (!domain) {
      throw new Error("AUTH0_DOMAIN not configured");
    }

    const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;
    const tokenUrl = `${baseUrl}/oauth/token`;

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: env.AUTH0_CLIENT_ID,
        client_secret: env.AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`Auth0 token exchange failed: ${response.statusText}`);
    }

    const data = await response.json<TokenResponse & { error?: string }>();

    if (data.error || !data.access_token) {
      throw new Error(`Auth0 OAuth error: ${data.error || "No access token"}`);
    }

    return data;
  },

  async fetchUserInfo(accessToken: string): Promise<NormalizedUser> {
    // Note: This assumes AUTH0_DOMAIN is available globally
    // In practice, you might need to pass env through or use a different approach
    throw new Error(
      "Auth0 userinfo requires domain - use handler.ts implementation",
    );
  },
};

// Export a factory function that takes env for full Auth0 support
export function createAuth0Provider(env: Env): OAuthProvider {
  const domain = env.AUTH0_DOMAIN;
  if (!domain) {
    throw new Error("AUTH0_DOMAIN not configured");
  }

  const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;

  return {
    name: "auth0",

    authorizationUrl(state: string, redirectUri: string): string {
      const url = new URL(`${baseUrl}/authorize`);
      url.searchParams.set("client_id", env.AUTH0_CLIENT_ID);
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", DEFAULT_SCOPE);
      url.searchParams.set("state", state);
      return url.toString();
    },

    async exchangeToken(
      code: string,
      redirectUri: string,
      _env: Env,
    ): Promise<TokenResponse> {
      const tokenUrl = `${baseUrl}/oauth/token`;

      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          client_id: env.AUTH0_CLIENT_ID,
          client_secret: env.AUTH0_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      });

      if (!response.ok) {
        throw new Error(`Auth0 token exchange failed: ${response.statusText}`);
      }

      const data = await response.json<TokenResponse & { error?: string }>();

      if (data.error || !data.access_token) {
        throw new Error(
          `Auth0 OAuth error: ${data.error || "No access token"}`,
        );
      }

      return data;
    },

    async fetchUserInfo(accessToken: string): Promise<NormalizedUser> {
      const userinfoUrl = `${baseUrl}/userinfo`;

      const response = await fetch(userinfoUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Auth0 user fetch failed: ${response.statusText}`);
      }

      const userData = await response.json<{
        sub: string; // Auth0's user ID
        email: string;
        name?: string;
        nickname?: string;
        picture?: string;
      }>();

      return {
        id: userData.sub,
        email: userData.email,
        name: userData.name || userData.nickname || userData.email,
        avatarUrl: userData.picture,
      };
    },
  };
}
