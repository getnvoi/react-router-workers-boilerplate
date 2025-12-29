import type { Route } from "./+types/app.settings.anthropic";
import { redirect } from "react-router";
import { getSession, commitSession } from "~/sessions.server";
import { getUserFromSession } from "~/services/auth.server";
import {
  buildAnthropicAuthUrl,
  exchangeAnthropicToken,
} from "~/services/oauth/providers/anthropic";
import { getDb, users } from "~/db";
import { eq } from "drizzle-orm";
import { AnthropicView } from "~/views/app/settings/anthropic-view";

/**
 * GET: Generate and display Anthropic OAuth URL
 * User must be authenticated first
 */
export async function loader({ request, context }: Route.LoaderArgs) {
  // Check if user is authenticated
  const user = await getUserFromSession(request);
  if (!user) {
    return redirect("/?error=authentication_required");
  }

  // Generate random state for CSRF protection
  const state = crypto.getRandomValues(new Uint8Array(16));
  const stateB64 = btoa(String.fromCharCode(...state));

  // Generate PKCE parameters and build auth URL
  const { url: authUrl, verifier } = await buildAnthropicAuthUrl(stateB64);

  // Store state and verifier in session
  const session = await getSession(request.headers.get("Cookie"));
  session.set("oauth_state", stateB64);
  session.set("oauth_verifier", verifier);

  // Get current Anthropic connection status
  const db = getDb(context.cloudflare.env.DB);
  const userRows = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  const currentUser = userRows[0];
  const isConnected = !!(
    currentUser?.anthropicAccessToken &&
    currentUser?.anthropicExpiresAt &&
    new Date(currentUser.anthropicExpiresAt) > new Date()
  );

  // Return session cookie and auth URL
  return {
    authUrl,
    isConnected,
    user,
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  };
}

export function headers({ loaderHeaders }: Route.HeadersArgs) {
  return loaderHeaders;
}

/**
 * POST: Exchange authorization code for access token
 */
export async function action({ request, context }: Route.ActionArgs) {
  // Check if user is authenticated
  const user = await getUserFromSession(request);
  if (!user) {
    return redirect("/?error=authentication_required");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const sessionState = session.get("oauth_state");
  const sessionVerifier = session.get("oauth_verifier");

  if (!sessionState || !sessionVerifier) {
    return redirect("/app/settings/anthropic?error=invalid_session");
  }

  try {
    const formData = await request.formData();
    const code = formData.get("code") as string;
    const state = formData.get("state") as string;

    // Validate state (CSRF protection)
    if (!code || state !== sessionState) {
      return redirect("/app/settings/anthropic?error=invalid_state");
    }

    // Exchange code for access token using PKCE verifier
    const tokenData = await exchangeAnthropicToken(code, sessionVerifier);

    // Save Anthropic tokens to current user's account
    const db = getDb(context.cloudflare.env.DB);
    await db
      .update(users)
      .set({
        anthropicAccessToken: tokenData.access_token,
        anthropicRefreshToken: tokenData.refresh_token,
        anthropicExpiresAt: tokenData.expires_in
          ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
          : null,
        anthropicScopes: JSON.stringify(["org:create_api_key", "user:profile", "user:inference"]),
      })
      .where(eq(users.id, user.id));

    // Clear OAuth session data
    session.unset("oauth_state");
    session.unset("oauth_verifier");

    // Redirect back to settings with success
    return redirect("/app/settings/anthropic?success=true", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    console.error("Anthropic OAuth error:", error);
    return redirect("/app/settings/anthropic?error=token_exchange_failed");
  }
}

/**
 * Component: Anthropic OAuth Settings Page
 */
export default function AnthropicSettings({ loaderData }: Route.ComponentProps) {
  return <AnthropicView {...loaderData} />;
}
