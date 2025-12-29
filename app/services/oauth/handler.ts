import { eq } from "drizzle-orm";
import type { NormalizedUser } from "./types";
import { getDb, users } from "~/db";
import type { SessionUser } from "~/sessions.server";
import { ensureUserHasWorkspace } from "~/services/workspace.server";
import { githubProvider } from "./providers/github";
import { googleProvider } from "./providers/google";
import { createAuth0Provider } from "./providers/auth0";
import { anthropicProvider } from "./providers/anthropic";

/**
 * Get the appropriate OAuth provider
 */
export function getOAuthProvider(providerName: string, env: Env) {
  switch (providerName) {
    case "github":
      return githubProvider;
    case "google":
      return googleProvider;
    case "auth0":
      return createAuth0Provider(env);
    case "anthropic":
      return anthropicProvider;
    default:
      throw new Error(`Unknown OAuth provider: ${providerName}`);
  }
}

/**
 * Build the authorization URL for a provider
 */
export function buildAuthorizationUrl(
  providerName: string,
  state: string,
  redirectUri: string,
  env: Env,
): string {
  const provider = getOAuthProvider(providerName, env);

  // Replace placeholder client IDs with actual env vars
  let authUrl = provider.authorizationUrl(state, redirectUri);

  // Replace placeholders with actual values
  authUrl = authUrl.replace("GITHUB_CLIENT_ID", env.GITHUB_CLIENT_ID || "");
  authUrl = authUrl.replace("GOOGLE_CLIENT_ID", env.GOOGLE_CLIENT_ID || "");
  authUrl = authUrl.replace("AUTH0_CLIENT_ID", env.AUTH0_CLIENT_ID || "");
  authUrl = authUrl.replace("AUTH0_DOMAIN", env.AUTH0_DOMAIN || "");

  return authUrl;
}

/**
 * Handle OAuth callback - exchange code, fetch user info, and find/create user
 *
 * Account linking strategy (following Aven pattern):
 * 1. Search for existing user by email
 * 2. If found, update provider and remoteId (link account)
 * 3. If not found, create new user
 */
export async function handleOAuthCallback(
  providerName: string,
  code: string,
  redirectUri: string,
  env: Env,
): Promise<SessionUser> {
  const provider = getOAuthProvider(providerName, env);

  // Exchange authorization code for access token
  const tokenData = await provider.exchangeToken(code, redirectUri, env);

  // Fetch user info from provider
  const userInfo = await provider.fetchUserInfo(tokenData.access_token);

  // Find or create user with account linking
  const user = await findOrCreateUser(
    providerName,
    userInfo,
    tokenData.access_token,
    env,
  );

  return user;
}

/**
 * Find existing user or create new one
 *
 * Linking strategy:
 * - Find by email (across all providers)
 * - Update provider and remoteId to link account
 * - This allows users to sign in with different providers using the same email
 */
async function findOrCreateUser(
  providerName: string,
  userInfo: NormalizedUser,
  accessToken: string,
  env: Env,
): Promise<SessionUser> {
  const db = getDb(env.DB);

  // Find existing user by email
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.email, userInfo.email))
    .limit(1);

  const existingUser = existingUsers[0];

  if (existingUser) {
    // User exists - update provider info and link account
    await db
      .update(users)
      .set({
        provider: providerName,
        remoteId: userInfo.id,
        accessToken: accessToken,
        login: userInfo.login || existingUser.login,
        name: userInfo.name || existingUser.name,
        avatarUrl: userInfo.avatarUrl || existingUser.avatarUrl,
        lastLoginAt: new Date().toISOString(),
      })
      .where(eq(users.id, existingUser.id));

    // Ensure user has a workspace
    await ensureUserHasWorkspace(db, existingUser.id, userInfo.name || userInfo.login);

    return {
      id: existingUser.id,
      login: userInfo.login || existingUser.login || "",
      name: userInfo.name || existingUser.name,
      avatarUrl: userInfo.avatarUrl || existingUser.avatarUrl,
    };
  }

  // No existing user - create new one
  const userId = crypto.randomUUID();

  await db.insert(users).values({
    id: userId,
    email: userInfo.email,
    provider: providerName,
    remoteId: userInfo.id,
    accessToken: accessToken,
    login: userInfo.login,
    name: userInfo.name,
    avatarUrl: userInfo.avatarUrl,
    lastLoginAt: new Date().toISOString(),
  });

  // Create default workspace for new user
  await ensureUserHasWorkspace(db, userId, userInfo.name || userInfo.login);

  return {
    id: userId,
    login: userInfo.login || "",
    name: userInfo.name,
    avatarUrl: userInfo.avatarUrl,
  };
}

/**
 * Check if a provider is configured
 */
export function isProviderConfigured(providerName: string, env: Env): boolean {
  switch (providerName) {
    case "github":
      return !!(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);
    case "google":
      return !!(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
    case "auth0":
      return !!(
        env.AUTH0_CLIENT_ID &&
        env.AUTH0_CLIENT_SECRET &&
        env.AUTH0_DOMAIN
      );
    case "anthropic":
      // Anthropic uses PKCE flow - no client secret needed
      // It's always available
      return true;
    default:
      return false;
  }
}

/**
 * Get all configured providers (for public login)
 * Note: Anthropic is excluded as it's a secondary authentication method
 */
export function getConfiguredProviders(env: Env): string[] {
  const allProviders = ["github", "google", "auth0"];
  return allProviders.filter((provider) => isProviderConfigured(provider, env));
}
