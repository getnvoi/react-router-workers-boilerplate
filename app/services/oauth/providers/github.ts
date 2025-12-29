import type { OAuthProvider, TokenResponse, NormalizedUser } from "../types";

const AUTHORIZATION_URL = "https://github.com/login/oauth/authorize";
const TOKEN_URL = "https://github.com/login/oauth/access_token";
const USER_INFO_URL = "https://api.github.com/user";
const USER_EMAIL_URL = "https://api.github.com/user/emails";
const DEFAULT_SCOPE = "read:user user:email";

export const githubProvider: OAuthProvider = {
  name: "github",

  authorizationUrl(state: string, redirectUri: string): string {
    const url = new URL(AUTHORIZATION_URL);
    url.searchParams.set("client_id", "GITHUB_CLIENT_ID"); // Placeholder - will be replaced
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("scope", DEFAULT_SCOPE);
    url.searchParams.set("state", state);
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
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub token exchange failed: ${response.statusText}`);
    }

    const data = await response.json<TokenResponse & { error?: string }>();

    if (data.error || !data.access_token) {
      throw new Error(`GitHub OAuth error: ${data.error || "No access token"}`);
    }

    return data;
  },

  async fetchUserInfo(accessToken: string): Promise<NormalizedUser> {
    // Fetch user profile
    const userResponse = await fetch(USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "nvoi-app",
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!userResponse.ok) {
      throw new Error(`GitHub user fetch failed: ${userResponse.statusText}`);
    }

    const userData = await userResponse.json<{
      id: number;
      login: string;
      name?: string;
      avatar_url?: string;
      email?: string;
    }>();

    // Fetch primary email if not public
    let email = userData.email;
    if (!email) {
      const emailsResponse = await fetch(USER_EMAIL_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "nvoi-app",
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });

      if (emailsResponse.ok) {
        const emails =
          await emailsResponse.json<
            Array<{ email: string; primary: boolean; verified: boolean }>
          >();
        const primaryEmail = emails.find((e) => e.primary && e.verified);
        email = primaryEmail?.email;
      }
    }

    if (!email) {
      throw new Error("No verified email found in GitHub account");
    }

    return {
      id: String(userData.id),
      email,
      name: userData.name || userData.login,
      avatarUrl: userData.avatar_url,
      login: userData.login,
    };
  },
};
