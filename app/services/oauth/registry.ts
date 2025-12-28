import type { OAuthProvider } from "./types";
import { githubProvider } from "./providers/github";
import { googleProvider } from "./providers/google";
import { auth0Provider } from "./providers/auth0";

export const providers: Record<string, OAuthProvider> = {
  github: githubProvider,
  google: googleProvider,
  auth0: auth0Provider,
};

export function getProvider(name: string): OAuthProvider {
  const provider = providers[name];
  if (!provider) {
    throw new Error(`OAuth provider "${name}" not configured`);
  }
  return provider;
}

export function isProviderConfigured(name: string, env: Env): boolean {
  try {
    const provider = providers[name];
    if (!provider) return false;

    // Check if required environment variables are set
    const clientIdKey = `${name.toUpperCase()}_CLIENT_ID`;
    const clientSecretKey = `${name.toUpperCase()}_CLIENT_SECRET`;

    return !!(env[clientIdKey] && env[clientSecretKey]);
  } catch {
    return false;
  }
}
