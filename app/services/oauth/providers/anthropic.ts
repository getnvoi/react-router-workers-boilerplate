import type { OAuthProvider, TokenResponse, NormalizedUser } from "../types";

const CLIENT_ID = "9d1c250a-e61b-44d9-88ed-5944d1962f5e";
const AUTHORIZATION_URL = "https://claude.ai/oauth/authorize";
const TOKEN_URL = "https://console.anthropic.com/v1/oauth/token";
const REDIRECT_URI = "https://console.anthropic.com/oauth/code/callback";
const SCOPES = "org:create_api_key user:profile user:inference";

export interface PKCEParams {
  verifier: string;
  challenge: string;
}

export interface AnthropicAuthResult {
  url: string;
  verifier: string;
}

/**
 * Generate PKCE parameters for secure OAuth flow
 * PKCE (Proof Key for Code Exchange) is more secure than client_secret
 */
export async function generatePKCE(): Promise<PKCEParams> {
  // Generate random verifier (43-128 characters)
  const verifier = crypto.randomUUID() + crypto.randomUUID();

  // Create SHA-256 hash of the verifier
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert hash to base64url format
  const bytes = new Uint8Array(hashBuffer);
  const challenge = btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return { verifier, challenge };
}

/**
 * Build Anthropic authorization URL with PKCE
 * Returns both the URL and the verifier (verifier must be stored in session)
 */
export async function buildAnthropicAuthUrl(
  state: string
): Promise<AnthropicAuthResult> {
  const pkce = await generatePKCE();

  const url = new URL(AUTHORIZATION_URL);
  url.searchParams.set("code", "true");
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", SCOPES);
  url.searchParams.set("code_challenge", pkce.challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);

  return {
    url: url.toString(),
    verifier: pkce.verifier,
  };
}

/**
 * Exchange authorization code for access token
 * The code from Anthropic contains both code and state separated by #
 */
export async function exchangeAnthropicToken(
  code: string,
  verifier: string
): Promise<TokenResponse> {
  // The code might contain both code and state separated by #
  const splits = code.split("#");
  const authCode = splits[0];
  const state = splits.length > 1 ? splits[1] : undefined;

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: authCode,
      state: state,
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic token exchange failed: ${response.status} - ${error}`);
  }

  const data = await response.json<TokenResponse & { error?: string }>();

  if (data.error || !data.access_token) {
    throw new Error(`Anthropic OAuth error: ${data.error || "No access token"}`);
  }

  return data;
}

/**
 * Fetch user information from Anthropic
 * Note: Anthropic's user API might be different - this is a placeholder
 */
export async function fetchAnthropicUserInfo(
  accessToken: string
): Promise<NormalizedUser> {
  // TODO: Update this URL when Anthropic provides a user info endpoint
  // For now, we'll use a placeholder that returns basic info

  // Anthropic doesn't have a public user info endpoint yet
  // We'll need to get this information from the token response or use defaults
  // For now, generate a user based on the access token

  const userId = crypto.randomUUID();

  return {
    id: userId,
    email: `anthropic-user-${userId.substring(0, 8)}@placeholder.com`,
    name: "Claude User",
    avatarUrl: undefined,
  };
}

/**
 * Anthropic OAuth provider (using PKCE flow)
 * Note: This provider works differently than others:
 * - Uses PKCE instead of client_secret
 * - Requires manual code entry (no automatic callback)
 * - See oauth.anthropic.tsx for the special handling
 */
export const anthropicProvider: OAuthProvider = {
  name: "anthropic",

  authorizationUrl(state: string, _redirectUri: string): string {
    // This is a placeholder - actual implementation needs async PKCE generation
    // The real flow is handled in oauth.anthropic.tsx
    return AUTHORIZATION_URL;
  },

  async exchangeToken(
    code: string,
    _redirectUri: string,
    _env: Env
  ): Promise<TokenResponse> {
    // This method signature doesn't support PKCE verifier
    // Use exchangeAnthropicToken directly in the route instead
    throw new Error(
      "Use exchangeAnthropicToken with verifier for Anthropic OAuth"
    );
  },

  async fetchUserInfo(accessToken: string): Promise<NormalizedUser> {
    return fetchAnthropicUserInfo(accessToken);
  },
};
